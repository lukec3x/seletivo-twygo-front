export interface Video {
  id: string;
  title: string;
  url: string;
}

export interface Course {
  id?: number;
  title: string;
  description: string;
  ends_at: string;
  image: string;
  video_urls: Video[];
}

export interface CourseCardProps {
  course: Course;
}

export interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (video: Video) => void;
  video: Video | null;
  isEditing: boolean;
}
