import colors from 'colors/safe';

const DEFAULT_TIMEOUT = 15000;

export const waitForElementById = async (
  id: string,
  timeout = DEFAULT_TIMEOUT
): Promise<void> => {
  console.debug(
    '---------------------------------\n',
    'Waiting for element by id:',
    colors.magenta(id)
  );
  await waitFor(element(by.id(id)))
    .toBeVisible()
    .withTimeout(timeout);
};

export const waitForElementByText = async (
  text: string,
  timeout = DEFAULT_TIMEOUT
): Promise<void> => {
  console.debug(
    '---------------------------------\n',
    'Waiting for element by text:',
    colors.magenta(text)
  );
  await waitFor(element(by.text(text)))
    .toBeVisible()
    .withTimeout(timeout);
};

export const waitForElementNotToBeVisibleByText = async (
  text: string,
  timeout = DEFAULT_TIMEOUT
): Promise<void> => {
  console.debug(
    '---------------------------------\n',
    'Waiting for element by text not to be visible:',
    colors.magenta(text)
  );
  await waitFor(element(by.id(text)))
    .not.toBeVisible()
    .withTimeout(timeout);
};
