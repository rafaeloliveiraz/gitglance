# Kangel fonts

The Kangel theme uses the following fonts, supplied from
https://github.com/lezzthanthree/Needy-Streamer-Overload/tree/master/%40Resources/Fonts

| Role | Font | Attribution and terms |
| --- | --- | --- |
| Text and number fallback | DinkieBitmap 7px | Copyright 2018–2020 Willie Liu / 3type. Redistribution permission confirmed by the contributor, mikotokuroko. Not relicensed under this project's MIT license. |
| Numbers | Press Start 2P | Copyright 2012 The Press Start 2P Project Authors. SIL OFL 1.1; see PressStart2P-LICENSE.txt. |
| Titles | Perfect DOS VGA 437 | Zeh Fernando, fatorcaos.com.br; original author attribution retained in the unmodified font file. Distributed by the author as freeware. |
| Title fallback | PixelMplus10 Regular | Copyright 2013 itouhiro; Copyright 2002–2013 M+ FONTS PROJECT. See PixelMplus-LICENSE.txt and PixelMplus-README.md. |

The font files are unmodified. Third-party fonts retain their respective rights and are not covered by the repository's MIT license. Contact the relevant rights holder for permissions beyond the terms supplied here.

Run `npm run build:fonts` to regenerate `lib/pixel-fonts.json`. This commits a Latin glyph subset plus punctuation as SVG paths so runtime rendering needs no font parser, filesystem font access, or remote font requests. Unsupported characters retain the original SVG text instead of disappearing.
