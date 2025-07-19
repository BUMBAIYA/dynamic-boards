import { useEffect, useState } from "react";

import {
  GithubIcon,
  TrendingUpIcon,
  XIcon,
  Users2Icon,
  StarIcon,
  AlbumIcon,
  type LucideIcon,
} from "lucide-react";

import {
  CustomModal,
  type CustomModalProps,
} from "@/example/components/custom-modal";
import type { MockCardContentCustomData } from "@/example/types";
import type { AddEditCardModalState } from "@/example/context/example-board-context";

export interface AddEditCardProps extends CustomModalProps {
  initialCardData?: MockCardContentCustomData;
  handleSubmit: (cardData: MockCardContentCustomData) => void;
  mode: AddEditCardModalState["mode"];
}

const DEFAULT_FORM_DATA: MockCardContentCustomData = {
  title: "",
  description: "",
  githubInfo: "profile",
};

const GITHUB_INFO_OPTIONS: {
  label: string;
  value: MockCardContentCustomData["githubInfo"];
  icon: LucideIcon;
}[] = [
  {
    label: "Profile",
    value: "profile",
    icon: GithubIcon,
  },
  {
    label: "Repos",
    value: "repos",
    icon: AlbumIcon,
  },
  {
    label: "Metrics",
    value: "metrics",
    icon: TrendingUpIcon,
  },
  {
    label: "Followers",
    value: "followers",
    icon: Users2Icon,
  },
  {
    label: "Stargazers",
    value: "stargazers",
    icon: StarIcon,
  },
];

export function AddEditCard(modalProps: AddEditCardProps) {
  const [formData, setFormData] = useState<MockCardContentCustomData>(
    modalProps.initialCardData ?? DEFAULT_FORM_DATA,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    modalProps.handleSubmit(formData);
  };

  // Pre-fill the form data if it is provided.
  useEffect(() => {
    if (modalProps.initialCardData && modalProps.mode === "edit") {
      setFormData(modalProps.initialCardData);
    } else if (modalProps.mode === "add") {
      setFormData(DEFAULT_FORM_DATA);
    }
  }, [modalProps.initialCardData, modalProps.mode]);

  return (
    <CustomModal {...modalProps}>
      <div className="flex w-full max-w-md flex-col rounded-xl bg-white">
        <div className="flex min-h-10 items-center justify-between border-b border-gray-200 p-3">
          <h1 className="font-medium">
            {modalProps.mode === "add"
              ? "Create New Card"
              : `Edit Card - ${modalProps.initialCardData?.title ?? "Untitled"}`}
          </h1>
          <button
            type="button"
            className="flex size-7 cursor-pointer items-center justify-center rounded-md p-1 hover:bg-gray-200"
            onClick={() => modalProps.onChange(false)}
          >
            <XIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3 p-3">
          <div className="flex flex-col space-y-0.5">
            <label htmlFor="title" className="text-xs">
              Card Title
            </label>
            <input
              autoFocus
              required
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="focus:outline-primary rounded-md border border-gray-200 px-2 py-1.5"
            />
          </div>

          <div className="flex flex-col space-y-0.5">
            <label htmlFor="description" className="text-xs">
              Card Description
            </label>
            <textarea
              required
              rows={3}
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="focus:outline-primary rounded-md border border-gray-200 px-2 py-1.5"
            />
          </div>

          <div className="flex flex-col space-y-0.5">
            <span className="text-xs">Github Info</span>
            <div className="grid grid-cols-3 gap-2">
              {GITHUB_INFO_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`focus:outline-primary focus:ring-primary flex cursor-pointer items-center space-x-2 rounded-md border border-gray-200 px-3 py-1 hover:bg-gray-100 ${
                    formData.githubInfo === option.value
                      ? "bg-primary/10 text-primary border-primary font-medium"
                      : ""
                  }`}
                  onClick={() => {
                    setFormData({
                      ...formData,
                      githubInfo: option.value,
                    });
                  }}
                >
                  <option.icon className="size-4" />
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex w-full justify-end pt-2">
            <button
              type="submit"
              className="min-h-8 cursor-pointer rounded-md bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-800 focus:ring-2 focus:ring-black focus:ring-offset-1 focus:outline-none"
            >
              <span className="text-sm font-medium">
                {modalProps.mode === "add" ? "Add Card" : "Save Changes"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </CustomModal>
  );
}
