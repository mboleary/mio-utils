# Warioware DIY / Made in Ore Utils

This repo contains an api for editing Warioware DIY / Made In Ore microgames in JavaScript.

## Packages

There are a few packages in this repo that are separated in such a way so as to allow use in other areas with minimal dependencies.

### mio-frontend

This contains extra functions to facilitate drawing graphics, and playing music. These are put here to keep the bloat out of the core library.

### libmio

This is the core library that can read / write binary save files, and the individual microgames contained within them.
