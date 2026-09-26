# Using your own sound effects

The « La suite de sons » game works without any audio file: the sounds are
synthesised by the application (see `src/lib/audio.js`). They are
recognisable, but stylised.

To replace them with real recordings, simply drop MP3 files in this folder,
named after the identifier of the sound. Nothing else to change: the
application detects the files present on first use and plays them instead of
the synthesis. The missing ones stay synthesised.

## Expected file names

Everyday sounds:

```
doorbell.mp3   phone.mp3     clock.mp3     horn.mp3
water.mp3      glass.mp3     drum.mp3      whistle.mp3
knock.mp3      applause.mp3  bell.mp3      engine.mp3
```

Animals (no synthesis for those: without a file, the device voice says the name
of the animal):

```
cat.mp3   dog.mp3   bird.mp3   cow.mp3   horse.mp3   rooster.mp3
```

## Advice

- **Length**: 1 to 2 seconds, the sound must be identifiable straight away.
- **Weight**: aim for 20 to 60 kB per file (mono, 64 kbps is enough). Files are
  cached for offline use, so there is no point making them heavier.
- **Level**: normalise the files against one another, so no sound is markedly
  louder than another within the same sequence.
- **Licence**: only use sounds whose licence allows redistribution (CC0 or
  public domain preferably) and keep a record of where they come from in this
  file.

## Provenance of the added files

Fill in this table as you go:

| File | Source | Author | Licence |
| --- | --- | --- | --- |
| `doorbell.mp3` | | | |
| `phone.mp3` | | | |
| `clock.mp3` | | | |
| `horn.mp3` | | | |
| `water.mp3` | | | |
| `glass.mp3` | | | |
| `drum.mp3` | | | |
| `whistle.mp3` | | | |
| `knock.mp3` | | | |
| `applause.mp3` | | | |
| `bell.mp3` | | | |
| `engine.mp3` | | | |
| `cat.mp3` | | | |
| `dog.mp3` | | | |
| `bird.mp3` | | | |
| `cow.mp3` | | | |
| `horse.mp3` | | | |
| `rooster.mp3` | | | |
