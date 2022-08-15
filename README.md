# Warioware DIY / Made in Ore Utils

This repo contains an api for editing Warioware DIY / Made In Ore microgames in JavaScript.

## Packages

There are a few packages in this repo that are separated in such a way so as to allow use in other areas with minimal dependencies.

### mio-frontend

This contains extra functions to facilitate drawing graphics, and playing music. These are put here to keep the bloat out of the core library.

### libmio

This is the core library that can read / write binary save files, and the individual microgames contained within them.

## Demos

In order to show things working, I've included a few of my microgames and a record in the `./assets/mio` directory. Alternatively, you can also acquire some `.mio` files from [The DoujinSoft Store](https://diy.tvc-16.science/), ([https://github.com/Difegue/DoujinSoft](https://github.com/Difegue/DoujinSoft)), though I've seen a few that end up being files filled with `0x00`.

### [temp](https://github.com/mboleary/mio-utils/tree/main/demo/temp)

This demo shows the library reading metadata from a microgame.

### [binvis](https://github.com/mboleary/mio-utils/tree/main/demo/binvis)

This is a basic binary viewer that demonstrates reading the graphics data from a microgame, and it also displays the rest of the game's data, despite that data not being graphics.

This demo can also be used to display arbitrary binary files.

### [binvis-advanced](https://github.com/mboleary/mio-utils/tree/main/demo/binvis-advanced)

This is an advanced version of the above tool, and has options to change parameters that control what information is displayed in the canvas, as well as having a small table to show ascii / hex data directly for a selected block.

![Image of demo](https://github.com/mboleary/mio-utils/tree/main/demo/binvis-advanced)