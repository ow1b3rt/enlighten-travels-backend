export function humanizeField(column) {
  return column
    .replace(/_id$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function parseUniqueViolationDetail(detail) {
  // Postgres detail format: Key (column)=(value) already exists.
  const match = detail?.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
  if (!match) return null;
  const [, column, value] = match;
  return { column, value };
}

export function parseForeignKeyDetail(detail) {
  // Postgres detail format: Key (column)=(value) is not present in table "other_table".
  const match = detail?.match(
    /Key \(([^)]+)\)=\(([^)]+)\) is not present in table "([^"]+)"/,
  );
  if (!match) return null;
  const [, column, value, table] = match;
  return { column, value, table };
}

export const CHECK_CONSTRAINT_MESSAGES = {
  rating_range: "Rating must be between 1 and 5", //testimonials rating
};

export function humanizeCheckConstraint(constraint) {
  if (!constraint) return "Invalid value provided";

  const cleaned = constraint
    .replace(/_check$/i, "")
    .replace(/_range$/i, "")
    .replace(/_valid$/i, "")
    .replace(/_constraint$/i, "")
    .replace(/_/g, " ")
    .trim();

  if (!cleaned) return "Invalid value provided";

  const readable = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return `${readable} constraint failed — value provided is invalid`;
}
