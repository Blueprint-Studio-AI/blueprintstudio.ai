# Handling scroll data is a bitch

...because the browser automatically adds "inertia" values so the data doesn't come in clean.

I used the lethargy-ts package to classify scroll events as intentional vs browser simulated.

It's def not perfect, but will prob work for big swipes.

In the future, if we want to add slow swipe support, we'll need to classify the swipe intensity first, and then send it to a lethargy instance with the right settings for purifying slow swipes.