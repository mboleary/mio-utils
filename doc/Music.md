# Music

The following was included in the `RecordMetadata.java` file that I was looking at:

```java
//0x100: jazz/swing byte
//0x101: tempo from 0x00-0x12
//0x102: ending flag position. 0x01-0x018, CANNOT be 0x00
//Song blocks start at 0x107 and are 0x114 bytes long each
//Notes go from 0x00 to 0x100 of each song block
//0x101 to 0x105 are volume indicators from 0x00 to 0x04
//0x106 to 0x10A are panning indicators
//0x10B to 0x10E are instruments
//0x10F is drums
//0x110-0x114 other track options?
//0x00-0x2F instruments
//0x00-0x07 drumsets
//0x00-0x0D
//0x05 bytes of 0x00 between blocks
//Blocks appear to be either 0x10F or 0x114 in length
//0=60
//1=70 etc
//notes go from 0x00 to 0x18, 0xFF = null notes
```