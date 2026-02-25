import { ProjectCardType } from "@/types/Sanity";
import ProjectCard from "./ProjectCard";

type Props = {
  projects: ProjectCardType[];
  language?: string;
};

const ProjectGrid = ({ projects, language }: Props) => {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard
          key={project._id}
          project={project}
          language={language}
          position={index + 1}
        />
      ))}
    </div>
  );
};

export default ProjectGrid;
