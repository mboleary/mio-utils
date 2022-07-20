# Class Structure

## Inheritance Structure

Here is a class structure for the different components of the library.


- SaveFile - generic save file
    - NDSSaveFile (extends SaveFile) - save file for Warioware DIY on NDS
    - WiiSaveFile (extends SaveFile) - Save file for the Wiiware title
- MioContainer - generic container for a game, comic book, or record
    - MioGame (extends MioContainer) - game container
    - MioRecord (extends MioContainer) - record container
    - MioManga (extends MioContainer) - comic book container
- ArtAsset - provides the assets used by objects and the background
- MusicBlock - provides the music used either by a game, or in a record
- AI - provides an interface with interacting with the AI in a game

## Types

SaveFile:
- validate()
- read()
- write()

MioContainer:
- name
- description
- brand
- creator
- serial: (has 3 parts)
- locked
- binary

MioGame:
- command
- length
- cartType
- cartColor
- logo
- logoColor
- art[]: holds the art assets
- music: music block used in game
- ai: Action Instructions ued in game

MioRecord:
- tempo
- swing
- flag: position of where the music stopping point is
- recordType
- recordColor
- logo
- logoColor
- blocks[]: music blocks in the record

MioManga:
- color
- logo
- logoColor
- art[]: provides 4 comic book pages of art to be used

ArtAsset:
- width: width in chunks
- height: height in chunks

MusicBlock:
- tracks[]

MusicTrack:
- number: number 0-4 inclusive, where 4 is the rhythm track
- instrument
- volume
- panning
- notes[]

## Other functions

- readBinary(binary, )