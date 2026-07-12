export const generateSafeFileName = (originalName, existingNames) => {
  if (!existingNames.includes(originalName)) {
    return originalName;
  }

  const nameParts = originalName.split('.');
  let extension = '';
  let baseName = originalName;

  if (nameParts.length > 1) {
    extension = '.' + nameParts.pop();
    baseName = nameParts.join('.');
  }

  let counter = 1;
  let newName = `${baseName} (${counter})${extension}`;

  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName} (${counter})${extension}`;
  }

  return newName;
};
