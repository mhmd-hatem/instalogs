/* eslint-disable @typescript-eslint/no-explicit-any */
export default class CSVHelper {
  generateCSVData(originalArray: TEvent[]): string {
    // Create a Set to hold all unique keys
    const headerSet: Set<string> = new Set();

    // Create an array to hold the rows of data
    const result: string[][] = [];

    // Helper function to flatten an object
    const flattenObject = (
      obj: { [key: string]: any },
      prefix = ""
    ): { [key: string]: any } => {
      return Object.keys(obj).reduce((acc: { [key: string]: any }, k) => {
        const pre = prefix.length ? prefix + "." : "";
        if (typeof obj[k] === "object")
          Object.assign(acc, flattenObject(obj[k], pre + k));
        else acc[pre + k] = obj[k];
        return acc;
      }, {});
    };

    // For each object in originalArray
    originalArray.forEach((a) => {
      // Flatten the object and create an array to hold the values for this row
      const flatObject = flattenObject(a);
      const row: string[] = [];

      // For each key-value pair in the object
      for (const [key, value] of Object.entries(flatObject)) {
        // Add the key to headerSet
        headerSet.add(key);

        // Add the value to row
        row.push(`${value}`);
      }

      // Add row to result
      result.push(row);
    });

    // Convert headerSet to an array
    const header: string[] = Array.from(headerSet);

    // Return the CSV string
    return (
      header.join(", ") +
      "\\n" +
      result.map((row) => row.join(", ")).join("\\n")
    );
  }

  downloadCSVFile(csvData: string, filename: string = "file.csv"): void {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    link.click();

    window.URL.revokeObjectURL(url);
  }
}
