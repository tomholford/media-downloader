export async function asyncForEach<T>(array: Array<T>, callback: (element: T, idx?: number, ary?: Array<T>) => Promise<void>) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
