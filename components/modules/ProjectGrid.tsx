import { ProjectCardType } from "@/types/Sanity";
import ProjectCard from "./ProjectCard";

type Props = {
  projects: ProjectCardType[];
  language?: string;
  readMoreLabel?: string;
};

const ProjectGrid = ({ projects, language, readMoreLabel }: Props) => {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {projects.map((project, index) => (
        <ProjectCard
          key={project._id}
          project={project}
          language={language}
          position={index + 1}
          readMoreLabel={readMoreLabel}
        />
      ))}
    </div>
  );
};

export default ProjectGrid;
