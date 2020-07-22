# Interactive Python Plots

Though the console only supports text output, we provide with the ability to
create plots and charts using matplotlib (and other libraries).  Here, we
will show you the basics of generating plots using Python3 and matplotlib.

In order to use matplotlib, the first thing you have to do is
[install the package](/repls/packages), or simply import the package and we will auto-install it for you:

```python
import matplotlib.pyplot as plt
```

Then, write the code to generate the plot as normal.  In this example,
we're just going to do something simple:

```python
plt.plot([1,2,3])
```

Now that we have a plot, we simple use `plt.show()` to open a new window with the plot.

```python
plt.show()
```

Running the code should then generate a new pane with your generated plot! Changing the plot and rerunning will update the graph in the display pane.

You can see the above example here:
[here](https://repl.it/@amasad/docs-matplotlib).

<iframe height="400px" width="100%" src="https://repl.it/@amasad/docs-matplotlib?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>