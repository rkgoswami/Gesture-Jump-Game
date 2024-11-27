# Game Project Report: Teachable Machine Integration

## Problem Statement
The objective of this project is to integrate a pose estimation model trained using Teachable Machine into a dynamic game environment. The game involves a player-controlled dinosaur that must avoid obstacles by jumping or ducking based on real-time pose predictions. The system is designed to:
1. Recognize player actions using a webcam.
2. Map these actions to game controls.
3. Evaluate the performance of the pose estimation model under varying conditions.

---

## Steps Involved

### 1. Problem Selection and Dataset Collection
We used a pose estimation model to detect user actions:
- **"Jump" Pose**: Simulated by raising both hands.
- **"Duck" Pose**: Simulated by crouching slightly or lowering hands.
- **"Neutral" Pose**: Standing or sitting normally. 

Using a webcam, training data was collected with consistent lighting and a neutral background. Three distinct classes (`Jump`, `Duck`, and `Neutral`) were defined, each with approximately 100 image samples per class.

### 2. Model Training
The model was trained using the default Teachable Machine settings:
- **Epochs**: 50  
- **Batch Size**: 16  
- **Learning Rate**: Default  

The training process yielded a sharable model URL that could be easily integrated into web-based applications.

### 3. Integration with the Game
The trained model was exported as a web-friendly TensorFlow.js model and integrated into the game. The following steps were performed:
- The webcam captured real-time frames.
- The model analyzed these frames to classify the pose.
- Based on predictions, the game executed corresponding actions (e.g., jumping or ducking).
- A "Play Again" button was added for better user interaction.

### 4. Testing and Analysis
The model's performance was tested under various scenarios:
1. Different lighting conditions (bright and dim environments).
2. Background variability (neutral vs. cluttered).
3. Variations in user posture (slight misalignments).

---

## Observations

### 1. Impact of Dataset Size and Training Parameters
- Increasing the number of training images improved the model's performance initially. However, after approximately 200 images per class, performance gains diminished.
- Extending the number of epochs from 50 to 100 showed marginal improvements in accuracy but increased the risk of overfitting.

### 2. Bias Toward Certain Classes
- The model demonstrated a slight bias toward the "Neutral" class, particularly when poses were ambiguous. This bias could be due to:
  - Insufficient variability in training samples for "Jump" and "Duck" classes.
  - Overrepresentation of "Neutral" samples during data collection.

### 3. Performance in Changing Conditions
- **Lighting**: Performance decreased significantly in dim lighting due to unclear pose detection.
- **Background Clutter**: The model occasionally misclassified poses when the background was busy, indicating a need for more robust preprocessing or data augmentation during training.
- **User Variability**: The model struggled to generalize across different users, particularly for individuals with smaller or larger builds than those represented in the training data.

---

## Conclusions
- The Teachable Machine platform provides a quick and effective way to train pose estimation models, suitable for applications like this game.
- Incorporating more diverse training samples (backgrounds, lighting, user variability) can improve robustness.
- To further enhance performance, preprocessing techniques like background subtraction or normalization could be employed.

---

## Future Work
- Re-train the model with augmented datasets to address bias and variability issues.
- Integrate more advanced pose estimation frameworks for increased accuracy.
- Extend the game with additional features, such as score tracking and dynamic difficulty adjustment.

---
