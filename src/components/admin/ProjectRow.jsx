export default function ProjectRow({ project, onEdit, onDelete }) {
  return (
    <div className="admin-project-row">
      <img src={project.imageURL} alt={project.title} width="50" />
      <div>
        <h3>{project.title}</h3>
        {/* FIX: guard against techStack being missing/non-array */}
        <p>{(project.techStack || []).join(", ")}</p>
      </div>
      <div className="admin-actions">
        <button onClick={() => onEdit(project)}>Edit</button>
        <button className="danger" onClick={() => onDelete(project._id)}>Delete</button>
      </div>
    </div>
  );
}