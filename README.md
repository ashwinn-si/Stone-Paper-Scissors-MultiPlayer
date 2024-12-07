# Stone Paper Scissors - Multiplayer Game

This is a multiplayer version of the classic Stone Paper Scissors game. Players can create a game room, join a room, and play against each other in real time🌏.

### Try the game live here:
[Play Stone Paper Scissors - Multiplayer](https://stone-paper-scissors-multiplayer.onrender.com/)

## Features

- **Room creation**: Players can create a game room and invite another player to join.
- **Real-time gameplay**: Players can choose their move (Stone, Paper, or Scissors) and see the results immediately.
- **Scorekeeping**: The game keeps track of scores for both players.
- **Rounds**: The game is played in multiple rounds, and the winner is determined based on the rounds won.
- **Game Over**: When a player reaches the required number of rounds, the game ends and shows the winner.

## Technologies Used

- **Node.js**: Backend server
- **Express**: Web framework for Node.js
- **MongoDB**: Database for storing game details
- **Socket.io**: Real-time communication between players
- **EJS**: Templating engine 

## Prerequisites

Make sure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (which comes with npm)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account for cloud database (or install MongoDB locally)

## Setup Instructions

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/ashwinn-si/Stone-paper-Scissors-MultiPlayer.git
cd Stone-paper-Scissors-MultiPlayer
```
### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
MONGO_URL=mongodb+srv://your_mongo_url_here
```

### 4. Reduce the delay [For running in Local Machine] (Optional)

```bash
Set Delay to 1s 
```

### 5. Start the application

```bash
node app
```
