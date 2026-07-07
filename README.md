# Human Emotion Detection using CNN and Deep Learning

A deep learning project that detects human emotions from facial expressions using Convolutional Neural Networks (CNNs) and the FER2013 dataset.

## Project Overview

This project aims to classify facial expressions into seven emotions:

- Angry 😠
- Disgust 🤢
- Fear 😨
- Happy 😄
- Neutral 😐
- Sad 😢
- Surprise 😲

The project currently supports:

- Single image emotion detection
- Face detection using OpenCV Haar Cascades
- Emotion prediction with confidence scores
- Model evaluation using confusion matrix and classification report

Planned features:

- Real-time webcam emotion detection
- Flask API backend
- React frontend
- Interactive analytics dashboard

---

## Tech Stack

### Machine Learning
- Python
- TensorFlow / Keras
- NumPy
- Pandas
- OpenCV
- Scikit-learn

### Visualization
- Matplotlib
- Seaborn

### Web Development (Planned)
- Flask/FastAPI
- React

---

## Project Structure

```text
human-emotion-detection/
│
├── assets/
│   ├── accuracy.png
│   └── loss.png
│
├── backend/
│   ├── notebooks/
│   │   ├── 01_dataset_exploration.ipynb
│   │   └── 02_training.ipynb
│   │
│   ├── predict.py
│   ├── face_predict.py
│   └── app.py
│
├── test_images/
│
├── reports/
│   ├── confusion_matrix.png
│   └── classification_report.txt
│
├── saved_models/
│   └── emotion_model.keras
│
├── frontend/
│
├── dataset/
│   ├── train/
│   └── test/
│
├── requirements.txt
├── README.md
└── .gitignore
```

---

## Dataset

Dataset used: **FER2013**

Dataset contains grayscale facial images of size:

```text
48 × 48 pixels
```

Number of emotion classes:

```text
7
```

### Download Dataset

Download FER2013 from Kaggle and extract it into:

```text
dataset/
├── train/
└── test/
```

---


## CNN Architecture

```text
Input (48x48x1)
        ↓
Conv2D (32 filters)
        ↓
MaxPooling2D
        ↓
Conv2D (64 filters)
        ↓
MaxPooling2D
        ↓
Flatten
        ↓
Dense (128)
        ↓
Dropout
        ↓
Dense (7)
```

Total trainable parameters:

```text
839,047
```

---

## Model Performance

After training for 15 epochs:

- Training Accuracy: ~61%
- Validation Accuracy: ~53%

The model shows signs of overfitting after approximately 10 epochs, which motivates further improvements using:

- Data Augmentation
- Batch Normalization
- Early Stopping
- Deeper CNN architectures

---

## Training Accuracy

![Accuracy Curve](assets/accuracy.png)

---

## Training Loss

![Loss Curve](assets/loss.png)

---

## Current Progress

## Current Progress

- [x] Project setup
- [x] Dataset exploration
- [x] Data preprocessing
- [x] CNN model creation
- [x] Model training
- [x] Model evaluation
- [x] Single image prediction
- [x] Face detection pipeline
- [ ] Real-time webcam emotion detection
- [ ] Flask API
- [ ] React frontend
- [ ] Analytics dashboard
- [ ] Improved CNN architecture

---

## Sample Results

### Happy Image
Prediction: Happy (100%)

### Angry Image
Prediction: Angry (64.90%)

### Sad Image
Prediction: Sad (37.29%)

---

## Future Improvements

- Data augmentation
- Transfer learning (ResNet/MobileNet)
- Real-time emotion detection
- Emotion analytics dashboard
- Model deployment

---

## Note:

The trained model is not included due to file size limitations.
It can be reproduced by running 02_training.ipynb.

---

## Evaluation

Validation Accuracy: ~53%

The model performs well on some emotions such as Happy and Angry but struggles on Sad and Neutral expressions due to similarities between these classes and limitations of the FER2013 dataset.

---

## Key Learnings

- Convolutional Neural Networks (CNNs)
- Image preprocessing and normalization
- Data generators in TensorFlow/Keras
- Model evaluation using confusion matrices and classification reports
- Face detection using OpenCV
- Deep learning workflow from training to inference and deployment

---

## Author

Arshpreet Kaur

B.Tech CSE | NIT Delhi

Learning Deep Learning through hands-on projects 🚀