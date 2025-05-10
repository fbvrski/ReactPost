import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (open) {
      setTitle("");
      setUserId(1);
      setBody("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) {
      return;
    }
    onAdd(title, userId, body);
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
              type="text"
              inputMode="numeric"
              required
              pattern="^[1-9][0-9]*$"
              value={userId.toString()}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");
                setUserId(onlyDigits === "" ? 0 : Number(onlyDigits));
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
          <Button variant="neutral" onClick={onClose} type="button">
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
