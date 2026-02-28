import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader
from sklearn.metrics import accuracy_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# =========================
# DEVICE
# =========================
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

# =========================
# TRANSFORMS (Strong for small dataset)
# =========================
train_transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomVerticalFlip(),
    transforms.RandomRotation(30),
    transforms.ColorJitter(brightness=0.4, contrast=0.4),
    transforms.RandomResizedCrop(224, scale=(0.6,1.0)),
    transforms.ToTensor()
])

val_test_transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor()
])

# =========================
# LOAD DATA
# =========================
train_data = datasets.ImageFolder("disease_stage2/train", transform=train_transform)
val_data = datasets.ImageFolder("disease_stage2/val", transform=val_test_transform)
test_data = datasets.ImageFolder("disease_stage2/test", transform=val_test_transform)

train_loader = DataLoader(train_data, batch_size=16, shuffle=True)
val_loader = DataLoader(val_data, batch_size=16)
test_loader = DataLoader(test_data, batch_size=16)

class_names = train_data.classes
print("Classes:", class_names)

# =========================
# MODEL SETUP
# =========================
model = models.efficientnet_v2_s(weights="IMAGENET1K_V1")

# Freeze backbone initially
for param in model.features.parameters():
    param.requires_grad = False

in_features = model.classifier[1].in_features

model.classifier = nn.Sequential(
    nn.Dropout(0.6),
    nn.Linear(in_features, 4)
)

model = model.to(device)

# =========================
# CLASS WEIGHTS (adjust if needed)
# Order must match class_names
# =========================
class_weights = torch.tensor([1.2, 1.4, 1.0, 1.6]).to(device)
criterion = nn.CrossEntropyLoss(weight=class_weights)

optimizer = optim.AdamW(model.parameters(), lr=0.001)

# =========================
# PHASE 1 TRAINING
# =========================
print("\nStarting Stage-2 Phase 1 Training...\n")

best_val_loss = float("inf")
patience = 5
counter = 0

for epoch in range(30):

    model.train()
    train_loss = 0

    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        train_loss += loss.item()

    model.eval()
    val_loss = 0

    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            val_loss += loss.item()

    print(f"Epoch {epoch+1}, Train Loss: {train_loss:.4f}, Val Loss: {val_loss:.4f}")

    if val_loss < best_val_loss:
        best_val_loss = val_loss
        counter = 0
        torch.save(model.state_dict(), "stage2_best.pth")
    else:
        counter += 1
        if counter >= patience:
            print("Early stopping triggered (Phase 1)")
            break

print("Phase 1 Completed")

# =========================
# FINE-TUNING PHASE
# =========================
print("\nStarting Fine-Tuning Phase...\n")

model.load_state_dict(torch.load("stage2_best.pth"))

# Unfreeze last 2 backbone blocks
for param in model.features[-2:].parameters():
    param.requires_grad = True

optimizer = optim.AdamW(model.parameters(), lr=1e-5)

best_val_loss = float("inf")
counter = 0

for epoch in range(10):

    model.train()
    train_loss = 0

    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        train_loss += loss.item()

    model.eval()
    val_loss = 0

    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            val_loss += loss.item()

    print(f"FineTune Epoch {epoch+1}, Train Loss: {train_loss:.4f}, Val Loss: {val_loss:.4f}")

    if val_loss < best_val_loss:
        best_val_loss = val_loss
        counter = 0
        torch.save(model.state_dict(), "stage2_best_finetuned.pth")
    else:
        counter += 1
        if counter >= patience:
            print("Early stopping triggered (Fine-Tuning)")
            break

print("Fine-Tuning Completed")

# =========================
# TEST EVALUATION
# =========================
print("\nEvaluating Final Stage-2 Model...\n")

model.load_state_dict(torch.load("stage2_best_finetuned.pth"))
model.eval()

all_preds = []
all_labels = []

with torch.no_grad():
    for images, labels in test_loader:
        images = images.to(device)
        outputs = model(images)
        _, preds = torch.max(outputs, 1)
        all_preds.extend(preds.cpu().numpy())
        all_labels.extend(labels.numpy())

test_accuracy = accuracy_score(all_labels, all_preds)
print("Stage-2 Final Test Accuracy:", test_accuracy)

# =========================
# CONFUSION MATRIX (Counts)
# =========================
cm = confusion_matrix(all_labels, all_preds)

plt.figure(figsize=(6,5))
sns.heatmap(cm,
            annot=True,
            fmt="d",
            cmap="Blues",
            xticklabels=class_names,
            yticklabels=class_names)

plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Stage-2 Confusion Matrix (Counts)")
plt.tight_layout()
plt.show()

# =========================
# CONFUSION MATRIX (Percentage)
# =========================
cm_percent = confusion_matrix(all_labels, all_preds, normalize="true")

plt.figure(figsize=(6,5))
sns.heatmap(cm_percent,
            annot=True,
            fmt=".2f",
            cmap="Greens",
            xticklabels=class_names,
            yticklabels=class_names)

plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Stage-2 Confusion Matrix (Percentage)")
plt.tight_layout()
plt.show()