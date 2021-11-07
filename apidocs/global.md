# (global)
## 🔒️ `OS_VERNUM`
`const <Number>` · The comparable version number of NanoPlay OS.

## 🔒️ `OS_VERSION`
`const <String>` · The version string of NanoPlay OS.

## ▶️ `bl.pressed`
`function` · Whether the bottom-left button is pressed.

**Returns:** `Boolean` · Whether the button is pressed

## ▶️ `br.pressed`
`function` · Whether the bottom-right button is pressed.

**Returns:** `Boolean` · Whether the button is pressed

## ▶️ `circle`
`function` · Draw a circle around a given coordinate with a specified radius.

**Parameters:**
* **`x`** (`Number`): The X component of the origin coordinate
* **`y`** (`Number`): The Y component of the origin coordinate
* **`radius`** (`Number`): The radius of the circle

## ▶️ `clear`
`function` · Clear the screen.

## ▶️ `close`
`function` · Close the app and return to the home screen.

## ▶️ `ellipse`
`function` · Draw an ellipse from a given coordinate.

**Parameters:**
* **`x`** (`Number`): The X component of the origin coordinate
* **`y`** (`Number`): The Y component of the origin coordinate
* **`w`** (`Number`): The width of the ellipse
* **`h`** (`Number`): The height of the ellipse

## ▶️ `fill`
`function` · Enable/disable the filling in of subsequent shapes. If disabled, only shape outlines are drawn.

**Parameters:**
* **`enable`** (`Boolean` = `false`): Whether to fill in subsequent shapes

## 🔠️ `fillShapes`
`var <Boolean>` · Whether to fill in the insides of shapes.

## ▶️ `getBatteryPercentage`
`function` · Get the battery's fullness percentage.

**Returns:** `Number` · The percentage fullness of the battery: a number within the bounds of 0 to 100 inclusive

## ▶️ `getFileList`
`function` · Get a list of data files in the NanoPlay's storage.

**Returns:** `Object` · A list of filenames of data files

## ▶️ `getLocaleCode`
`function` · Get the NanoPlay's current locale code. For example, for English (United Kingdom), the locale code would be `"en_GB"`.

**Returns:** `String` · The locale code of the currently-set locale

## ▶️ `getPixel`
`function` · Get a specified pixel's value.

**Parameters:**
* **`x`** (`Number`): The X component of the pixel's coordinate
* **`y`** (`Number`): The Y component of the pixel's coordinate

**Returns:** `Boolean` · Whether the pixel is on or off

## ▶️ `getTemperatureCelsius`
`function` · Get the current measured temperature in degrees Celsius.

**Returns:** `Number` · The temperature in degrees Celsius

## ▶️ `getTemperatureFahrenheit`
`function` · Get the current measured temperature in degrees Fahrenheit.

**Returns:** `Number` · The temperature in degrees Fahrenheit

## ▶️ `getTemperatureKelvin`
`function` · Get the current measured temperature in Kelvin.

**Returns:** `Number` · The temperature in Kelvin

## ▶️ `getTextWidth`
`function` · Calculate the width of a given string of text

**Parameters:**
* **`text`** (`*`): The string to calculate the textual width of
* **`mini`** (`Boolean` = `false`): Whether the text is set in a smaller font

**Returns:** `Number` · The width of the text in pixels

## ▶️ `invert`
`function` · Enable/disable the inversion of subequent graphics. If enabled, filled-in shapes will appear as off whereas they would appear as on when inversion is disabled.

**Parameters:**
* **`enable`** (`Boolean` = `false`): Whether to invert subsequent graphics

## ▶️ `line`
`function` · Draw a line from one coordinate to another.

**Parameters:**
* **`x1`** (`Number`): The X component of the first coordinate
* **`y1`** (`Number`): The Y component of the first coordinate
* **`x2`** (`Number`): The X component of the second coordinate
* **`y2`** (`Number`): The Y component of the second coordinate

## ▶️ `nfcSet`
`function` · Set the NanoPlay's NFC chip to emit the specified URL to nearby devices.

**Parameters:**
* **`url`** (`String`): The URL to emit to nearby devices

## ▶️ `readFile`
`function` · Read a data file from the NanoPlay's storage.

**Parameters:**
* **`filename`** (`String`): The filename to read from: a string with only characters a-z, A-Z and 0-9, between 1 to 20 characters long

**Returns:** `String` · The contents of the data file that have been read

## ▶️ `readPin`
`function` · Read an analog pin's value (on the back of the NanoPlay).

**Parameters:**
* **`pin`** (`Number`): Index of the pin: an integer within the bounds 0 to 5 inclusive

**Returns:** `Number` · The analog value of the pin: a real number within the bounds 0 to 1 inclusive

## ▶️ `rect`
`function` · Draw a rectangle from a given coordinate.

**Parameters:**
* **`x`** (`Number`): The X component of the origin coordinate
* **`y`** (`Number`): The Y component of the origin coordinate
* **`w`** (`Number`): The width of the rectangle
* **`h`** (`Number`): The height of the rectangle

## ▶️ `setPixel`
`function` · Set a specified pixel's value.

**Parameters:**
* **`x`** (`Number`): The X component of the pixel's coordinate
* **`y`** (`Number`): The Y component of the pixel's coordinate
* **`on`** (`Boolean` = `true`): Whether the pixel is on or off

## ▶️ `statusBar`
`function` · Enable/disable showing the status bar. The status bar is drawn over everything else.

**Parameters:**
* **`enable`** (`Boolean` = `false`): Whether to show the status bar

## ▶️ `text`
`function` · Draw a string of text from a given coordinate.

**Parameters:**
* **`x`** (`Number`): The X component of the origin coordinate
* **`y`** (`Number`): The Y component of the origin coordinate
* **`text`** (`*`): The string to be drawn as text
* **`mini`** (`Boolean` = `false`): Whether to draw the text in a smaller font

## ▶️ `tl.pressed`
`function` · Whether the top-left button is pressed.

**Returns:** `Boolean` · Whether the button is pressed

## ▶️ `tr.pressed`
`function` · Whether the top-right button is pressed.

**Returns:** `Boolean` · Whether the button is pressed

## ▶️ `writeFile`
`function` · Write a data file to the NanoPlay's storage. Any data files with the same name will be overwritten.

**Parameters:**
* **`filename`** (`String`): The filename to write to: a string with only characters a-z, A-Z and 0-9, between 1 to 20 characters long
* **`data`** (`String`): The contents of the data file to write

## ▶️ `writePin`
`function` · Write an analog pin's value (on the back of the NanoPlay).

**Parameters:**
* **`pin`** (`Number`): Index of the pin: an integer within the bounds 0 to 5 inclusive
* **`value`** (`Number`): The The analog value of the pin: a real number within the bounds 0 to 1 inclusive