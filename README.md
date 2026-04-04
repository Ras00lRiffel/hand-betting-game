# HandBettingGame

This project is a hand betting game that uses Mahjong-style tiles (Dragon, Wind, Numbers).

This is a predicting game.

## Walkthrough Video

Please find the walkthrough video at this link: https://drive.google.com/file/d/1hjMl6ONMZwNSnDjueVRi0ODLW24w2MHh/view?usp=drive_link

## Rules

- You are dealt 2 tiles.
- You need to bet "higher" or "lower", predicting whether your next pair of tiles will have a higher or lower total value than your previous pair.
- Each tile has a value. Number tiles are valued at their number. Dragon and Wind tiles have dynamic values that can change based on your predictions.
- If your prediction is correct, you win the round and the values of non-number tiles in your hand increase. If you are wrong, their values decrease.
- The game ends if any tile value reaches 0 or 10, or if you run out of tiles after two shuffles.

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd hand-betting-game
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   ng serve
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:4200/
   ```
   The application will automatically reload whenever you modify any of the source files.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.
