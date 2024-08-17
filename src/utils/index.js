const fs = require('fs');

// Function to filter JSON based on specified types
function filterJSON(jsonData, types) {
  return jsonData.filter(obj => types.includes(obj.type));
}

// Function to normalize JSON by removing unnecessary fields
function normalizeJSON(jsonData) {
  return jsonData.map(obj => {
    // Remove unnecessary fields
    delete obj.id;
    delete obj._rid;
    delete obj._self;
    delete obj._etag;
    delete obj._attachments;
    delete obj._ts;
    return obj;
  });
}

// Read the JSON file
fs.readFile('input.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);

    // Types to filter
    const typesToFilter = ['codeinput', 'checkboxgroup', 'composite', 'table'];

    // Filter JSON based on specified types
    const filteredJSON = filterJSON(jsonData, typesToFilter);

    // Normalize JSON
    const normalizedJSON = normalizeJSON(filteredJSON);

    // Write the normalized JSON to another file
    fs.writeFile('output.json', JSON.stringify(normalizedJSON, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing normalized JSON to file:', err);
        return;
      }
      console.log('Normalized JSON has been written to output.json');
    });
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});
