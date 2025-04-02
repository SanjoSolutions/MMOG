export async function scanThroughAll(
  createScanInput: () => any,
  doSomethingWithOutput: (output: any) => Promise<void>,
): Promise<void> {
  // const database = createDynamoDBDocumentClient()
  // let lastEvaluatedKey: Record<string, any> | undefined = undefined
  // do {
  //   const input = createScanInput()
  //   if (lastEvaluatedKey) {
  //     input.ExclusiveStartKey = lastEvaluatedKey
  //   }
  //   const output = (await database.send(
  //     new ScanCommand(input),
  //   )) as ScanCommandOutput
  //   lastEvaluatedKey = output.LastEvaluatedKey
  //   await doSomethingWithOutput(output)
  // } while (lastEvaluatedKey)
}
