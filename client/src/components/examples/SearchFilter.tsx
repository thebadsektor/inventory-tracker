import { useState } from "react";
import { SearchFilter } from "../SearchFilter";

export default function SearchFilterExample() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "in" | "out">("all");
  const [category, setCategory] = useState("all");

  const categories = ["Electronics", "Tools", "Office Supplies", "Furniture"];

  return (
    <SearchFilter
      searchQuery={search}
      onSearchChange={setSearch}
      statusFilter={status}
      onStatusChange={setStatus}
      categoryFilter={category}
      onCategoryChange={setCategory}
      categories={categories}
    />
  );
}
