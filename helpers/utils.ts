export function waitforme(milisec) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("");
    }, milisec);
  });
}
