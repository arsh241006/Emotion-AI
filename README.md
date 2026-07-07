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

The model is trained on the FER2013 dataset and will support:

- Image emotion detection
- Real-time webcam emotion detection
- Confidence score visualization
- Interactive dashboard with analytics

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
├── backend/
│   ├── notebooks/
│   │   └── 01_dataset_exploration.ipynb
│   ├── model/
│   └── api/
│
├── frontend/
│
├── dataset/
│   ├── train/
│   └── test/
│
├── saved_models/
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

## Current Progress

- [x] Project setup
- [x] Virtual environment setup
- [x] Dataset exploration
- [x] Emotion distribution analysis
- [x] CNN architecture creation
- [ ] Data preprocessing
- [ ] Model training
- [ ] Model evaluation
- [ ] Web application
- [ ] Real-time webcam detection
- [ ] Dashboard and analytics

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

## Author

Arshpreet Kaur

B.Tech CSE | NIT Delhi

Learning Deep Learning through hands-on projects 🚀