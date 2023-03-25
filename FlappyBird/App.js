import React, { Component } from "react";
import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity } from "react-native";
import { Constants } from "./Contansts";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import Bird from "./Bird";
import Floor from "./Floor"
import Physics, { resetPipes } from "./Physics";


export default class App extends Component {

  constructor(props) {
    super(props);
    this.gameEngine = null
    this.entities = this.setupWorld()

    this.state = {
      running: true,
      score: 0
    }
  }

  setupWorld() {

    let engine = Matter.Engine.create({ enableSleeping: false })
    let world = engine.world
    world.gravity.y = 0.0

    let bird = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT / 2, Constants.BIRD_WIDTH, Constants.BIRD_HEIGHT)
    let floor1 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT - 25,
      Constants.MAX_WIDTH + 4,
      50,
      { isStatic: true }
    )

    let floor2 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH + (Constants.MAX_WIDTH / 2),
      Constants.MAX_HEIGHT - 25,
      Constants.MAX_WIDTH + 4,
      50,
      { isStatic: true }
    )

    Matter.World.add(world, [bird, floor1, floor2])

    Matter.Events.on(engine, "collisionStart", (event) => {
      let pairs = event.pairs

      this.gameEngine.dispatch({ type: "game-over" })
    })

    return {
      physics: { engine: engine, world: world },
      floor1: { body: floor1, renderer: Floor },
      floor2: { body: floor2, renderer: Floor },
      bird: { body: bird, pose: 1, renderer: Bird },
    }
  }

  onEvent = (e) => {
    if (e.type === "game-over") {
      this.setState({
        running: false
      })
    } else if (e.type === "score") {
      this.setState({
        score: this.state.score + 1
      })
    }
  }

  reset = () => {
    resetPipes()
    this.gameEngine.swap(this.setupWorld())
    this.setState({
      running: true,
      score: 0
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={require("./assets/background.jpeg")} resizeMode="stretch" />
        <GameEngine
          ref={(ref) => { this.gameEngine = ref }}
          style={styles.gameContainer}
          systems={[Physics]}
          running={this.state.running}
          onEvent={this.onEvent}
          entities={this.entities}
        >
          <StatusBar hidden />
        </GameEngine>
        <Text style={styles.score}>{this.state.score}</Text>
        {!this.state.running && <TouchableOpacity style={styles.fullScreenBtn} onPress={this.reset}>
          <View style={styles.fullScreen}>
            <Text style={styles.gameOverText}>
              Game Over
            </Text>
            <Text style={styles.gameOverSubText}>
              Try Again
            </Text>
          </View>
        </TouchableOpacity>}
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: Constants.MAX_WIDTH,
    height: Constants.MAX_HEIGHT
  },
  gameContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  fullScreenBtn: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1
  },
  fullScreen: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    opacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverText: {
    color: "white",
    fontSize: 48
  },
  gameOverSubText: {
    color: "white",
    fontSize: 24
  },
  score: {
    position: "absolute",
    color: "white",
    fontSize: 72,
    top: 50,
    left: Constants.MAX_WIDTH / 2 - 20,
    textShadowColor: "#444444",
    textShadowOffset: { width: 2, height: 2 },
    textShadowColor: 2,
  }
})