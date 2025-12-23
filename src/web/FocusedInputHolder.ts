class FocusedInputHolder {
  static shared = new FocusedInputHolder();

  #currentFocusedInput: WeakRef<HTMLInputElement> | null = null;

  set(input: HTMLInputElement) {
    this.#currentFocusedInput = input ? new WeakRef(input) : null;
  }

  get() {
    return this.#currentFocusedInput?.deref();
  }

  focus() {
    this.get()?.focus();
  }
}

const singleton = new FocusedInputHolder();

document.addEventListener("focusin", (event) => {
  singleton.set(event.target as HTMLInputElement);
});

export default singleton;
