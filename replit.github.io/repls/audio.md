# Audio on repl.it [BETA]

User's can play audio in their repls without creating a website.

To make it as easier for users, we based audio on a request system. This means that users just need to request for a file to be played, rather than reading it directly. Although they aren't directly reading the files users can still control:

+ The volume of your file
+ How many times your file is played (without sending multiple requests)
+ Whether your file is playing (whether its paused or not)

Another builtin feature is the ability for users to play as many files as they would like.

Supported files are `.wav` and `.aiff` files (detailed more later). 

Currently, we have javascript and python libraries for audio,

An example of use with the js lib is shown below, and generated docs can be found [here](https://audio-js-docs--allawesome497.repl.co/).

<iframe frameborder="0" width="100%" height="500px" src="https://repl.it/@turbio/audio-js-demo?lite=true"></iframe>

As for an example using the python library is shown below, and some documentation can be found [here](https://pypi.org/project/replit/).

<iframe frameborder="0" width="100%" height="500px" src="https://repl.it/@AllAwesome497/py-audio-demo?lite=true"></iframe>

# Developing an audio library for repl.it

Since we know not everyone uses python or js, we decided to document how to make a lib.

## Step One: Add an audio source


Currently, supported file types are `.wav` and `.aiff`.

Files are played in mono / single channel mode, files with multiple channels will be read and converted into single channel data.

If you have an mp3 file, you can find an online converter such as [this one](https://onlineaudioconverter.com/#).

Note that **files MUST BE at 44,100 hertz, or 44.1khz**. If your file is not at 44,100 hertz you can convert it [here](https://onlineaudioconverter.com/#). Note that it will still be played if its not at 44,100hertz, although it will be played as if it was 44,100hertz. For example, if your file is at 22,050 hertz it will be played at 2x speed.

Currently there are 2 libs already created:
+ [For python](https://pypi.org/project/replit/) (This is preinstalled in python3 repls). Please not that this might not work with python 2.
+ [For js/ts](https://github.com/replit/audio-js)

To make this as light as possible on your repl's resources, audio files are played via a request system.  To make a request, simply write to `/tmp/audio`. Valid source creation requests are formatted as shown below:

```js
{
	"File": "/path/to/file", // The path to the audio file
	"Volume": 1.5, // A float64 value to determine audio volume.  1 is the file's native volume. Defaults to 1.
	"DoesLoop": false, // Whether the file should be repeated or not.
	"LoopCount": -1 // How many times to repeat the file.  Set to a negative value to create an endless loop.
}
```

## Step Two:  Reading the data of currently played audio

Each file source, formatted in json is formatted like so:

```js
{
	"Name": "file/name", // The path to the file.
	"FileType": "wav/aiff", // The type of the file.
	"Volume": 1.5, // The provided volume.
	"Duration": 123, // The estimated duration of the file in milliseconds.
	"Remaining": 122, // The estimated time remaining in milliseconds.
	"Paused": false,
	"Loop": 0, // How many more times the source will repeat.
	// Negative values are constant and mean that it will repeat an infinite amount.
	"ID": 1, // The ID of the source.
	"EndTime": "2020-04-23T22:30:46.486250072Z", // Estimated time for the file to be done playing.
	"StartTime": "2020-04-23T22:30:46.486250072Z" // When the file started playing. 
}
```
Note: Timestamps are formatted like so: `yyyy-MM-dd'T'HH:mm:ssZ`


In order to read the data from the sources, you need to read `/tmp/audioStatus.json`.
The file is formatted as shown below:

```js
{
	"Sources": [], // A list of sources, formatted as above.
	"Running": false, // Whether or not anything is playing. true means sources are being played.
	"Disabled": false, // Whether or not the sound program is running. Should only be true if the repl is stopped.
}
```

Note: After a source finishes playing it is removed from the known sources.

## Step Three: Managing current sources.

In order to pause or edit a playing source, you first need it's ID.
You can get it's ID by reading `/tmp/audioStatus.json`, as detailed above.

Edit requests are formatted as shown below:
```js
{
	"ID": 1, // The id of the source
	"Volume": 1, // The volume for the source to be played at
	"Paused": false, // Wether the file is paused or not.
	"DoesLoop": false, // Wether the file should be repeated or not.
	"LoopCount": -1 // How many times to repeat the file.  Set to a negative value to create an endless loop.
}
```

All fields **must** be provided, with the exception of `LoopCount` when `DoesLoop` is `false`.

For editing a source, I would just do something like the following, or the equivelent in other langs:

```py
import json

class NoSuchPlayerException(Exception): pass

def update_source(id, **changes):
    player_data = read_status()  # Assume read_status reads /tmp/audioStatus.json

    for s in player_data['Sources']:
        if s['ID'] == id:
            data = s
            break
    
    if not data:
        raise NoSuchPlayerException(f'No player with id "{id}" found!')

    data.update({key.title(): changes[key] for key in changes})

    with open('/tmp/audio', 'w') as f:
        f.write(json.dumps(data))
```

There is also a simple demo created in python available [here](https://repl.it/@AllAwesome497/Audio-Demo)
