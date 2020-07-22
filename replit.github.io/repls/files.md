## Modules

When starting a new repl, we create a "main" file for you so you can start coding quickly. However, if you want to split your project into multiple files, you can add new files from the files sidebar.

<img width="50%" src="/images/repls/add_file.png" />

Then, you can import the module by referencing the name. Every language will have different syntax for doing this, so please consult the respective language documentation.

Here is an example in Python:

<iframe height="400px" width="100%" src="https://repl.it/@amasad/modules?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

## Uploading and assets

You can upload files by either dragging and dropping them into the files sidebar or by clicking the "three dot menu" and selecting upload file (or folder):

<img width="50%" src="/images/repls/upload.png" />

We support uploading any file type including images, video, and audio files, which will be
displayed correctly in the browser.  These files can also be programmatically generated.

For example, you can upload an image, alter it
programmatically, and save the result to a new image.
Like this (which you can try out [here](https://repl.it/@masonclayton/rotatify)):

You can edit a file's name or delete it if you wish by clicking on the
<img
  src="https://i.imgur.com/Fsg7XB2.png"
  style="height: 24px; vertical-align:text-bottom; width: 6px; margin: 0 3px; display: inline-block;"
/>
icon beside it. When renaming your file, make sure to use the correct
file extension.

Two things to note about files:

1. They can be of any type/extension and you can use them in your code however you'd like.
2. Files will be placed in the current working directory; generally you'd access it through
the relative path './filename.ext'.

Here's a few examples on files in different languages:
- Ruby: [Word frequency in a file](https://repl.it/@masonclayton/Word-frequency-in-a-file)
- Java: [Classes in different files](https://repl.it/@masfrost/Classes-in-different-files)
- Python: [Reading from CSV](https://repl.it/@amasad/CSV-Example)

# File Changes

Programmatic file changes will get synced down to the repl automatically. In case of images we will display and update them for you on each change. This makes it really nice for plotting and data science work, which we cover in [Python plots](/repls/python-plots).
