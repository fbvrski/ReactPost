import React, { useState } from "react";
import { Button } from "../ui/Button";

interface AddPostModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (title: string, userId: number, body: string) => void;
}

export const AddPostModal: React.FC<AddPostModalProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState<number>(1);
  const [body, setBody] = useState("");

  if (!open) return null;

  const resetForm = () => {
    setTitle("");
    setUserId(1);
    setBody("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    onAdd(title, userId, body);
    resetForm();
    onClose();
  };

  const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetForm();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-post-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    >
      <form
        onSubmit={handleSubmit}
        onReset={handleReset}
        className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6"
      >
        <h2 id="add-post-title" className="text-xl font-semibold mb-4">
          Add New Post
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="post-title"
              className="block text-sm font-medium mb-1"
            >
              Title
            </label>
            <input
              id="post-title"
              type="text"
              required
              minLength={3}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label
              htmlFor="post-userid"
              className="block text-sm font-medium mb-1"
            >
              User ID
            </label>
            <input
              id="post-userid"
              type="number"
              inputMode="numeric"
              required
              min={1}
              max={10}
              step={1}
              value={userId}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                const limitedValue = Number.isNaN(value)
                  ? 0
                  : Math.min(Math.max(value, 1), 10);
                setUserId(limitedValue);
              }}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label
              htmlFor="post-body"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="post-body"
              required
              minLength={10}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="neutral" type="reset">
            Cancel
          </Button>
          <Button type="submit" data-testid="add-post-modal">
            Add
          </Button>
        </div>
      </form>
    </div>
  );
};
