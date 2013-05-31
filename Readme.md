
# Atkinson

  Atkinson can remember form input data across requests, [demo](http://yields.github.io/atkinson/index.html).

## Installation

    $ component install yields/atkinson

## API

### Atkinson.selector

  default selector for `form.querySelectorAll()`.

### Atkinson.store

  localStorage with fallback to an empty object.

### new Atkinson([prefix], form)

  initialize new `Atkinson` instance with the given optional
  `prefix` and `form`.

### atkinson.save()

  use `Atkinson.selector` to find `input, textarea, select` and save
  their values.

### atkinson.restore()

  restore saved data, Atkinson will fill out the form.

### atkinson.clean()

  clean all stored data.

### atkinson.prefix

  the prefix that was passed to `Atkinson` constructor,
  this is defaulted to `form.id`.

### atkinson.el

  the `form` that was passed to `Atkinson` constructor.

### atkinson.selector

  instance selector string, defaulted to `Atkinson.selector`

### atkinson.store

  instance store, defaulted to `Atkinson.store`

## License

  MIT
