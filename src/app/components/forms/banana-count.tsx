import React, { FormEvent, useState } from "react";

type Props = {
  count: number;
  onSubmit: (newCount: number) => void;
};

function BananaCountForm({ onSubmit, count }: Props) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newCount = parseInt(formData.get("count") as string, 10);
    if (!isNaN(newCount)) {
      onSubmit(newCount);
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="h-14 flex items-center space-x-2 bg-white p-4 rounded-lg"
    >
      <div className="flex items-center space-x-2">
        <label htmlFor="count">Count:</label>
        <input
          type="number"
          min={5}
          max={50}
          name="count"
          className="w-16"
          defaultValue={count}
        />
      </div>
      <button type="submit" className="bg-gray-100 p-2 rounded-md">
        Update
      </button>
    </form>
  );
}

export default BananaCountForm;
