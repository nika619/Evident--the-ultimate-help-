/**
 * Evident Proof Graph
 * Logical relational graph representing student technical provenance.
 *
 * Connects:
 * ProjectSource <───> SourceFile / Commit <───> EvidenceItem <───> Skill
 */

import { ProjectSource, EvidenceItem } from './types';

export interface GraphNode {
  id: string;
  label: string;
  type: 'project' | 'skill' | 'file' | 'evidence';
  subtext?: string;
  projectId?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: 'implements' | 'demonstrates' | 'contains';
}

export class ProofGraph {
  private projects: Map<string, ProjectSource> = new Map();
  private evidence: Map<string, EvidenceItem> = new Map();

  constructor(projects: ProjectSource[] = [], evidence: EvidenceItem[] = []) {
    projects.forEach((p) => this.projects.set(p.id, p));
    evidence.forEach((e) => this.evidence.set(e.id, e));
  }

  public addProject(project: ProjectSource): void {
    this.projects.set(project.id, project);
  }

  public addEvidence(item: EvidenceItem): void {
    this.evidence.set(item.id, item);
  }

  public getProjects(): ProjectSource[] {
    return Array.from(this.projects.values());
  }

  public getEvidence(): EvidenceItem[] {
    return Array.from(this.evidence.values());
  }

  public getEvidenceById(id: string): EvidenceItem | undefined {
    return this.evidence.get(id);
  }

  public getEvidenceForProject(projectId: string): EvidenceItem[] {
    return Array.from(this.evidence.values()).filter((e) => e.projectId === projectId);
  }

  public getEvidenceForSkill(skillNameOrId: string): EvidenceItem[] {
    const query = skillNameOrId.toLowerCase();
    return Array.from(this.evidence.values()).filter(
      (e) => e.skillId.toLowerCase().includes(query) || e.skillName.toLowerCase().includes(query)
    );
  }

  public getDistinctSkills(): { id: string; name: string; count: number }[] {
    const map = new Map<string, { id: string; name: string; count: number }>();
    this.evidence.forEach((e) => {
      const existing = map.get(e.skillId);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(e.skillId, { id: e.skillId, name: e.skillName, count: 1 });
      }
    });
    return Array.from(map.values());
  }

  /**
   * Generates graph nodes and edges for the Interactive Visualizer
   */
  public generateVisualGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const addedNodeIds = new Set<string>();

    // 1. Project Nodes
    this.projects.forEach((proj) => {
      nodes.push({
        id: proj.id,
        label: proj.name,
        type: 'project',
        subtext: proj.primaryLanguage,
      });
      addedNodeIds.add(proj.id);
    });

    // 2. Skill Nodes & Edges
    this.evidence.forEach((ev) => {
      if (!addedNodeIds.has(ev.skillId)) {
        nodes.push({
          id: ev.skillId,
          label: ev.skillName,
          type: 'skill',
        });
        addedNodeIds.add(ev.skillId);
      }

      // Edge from Project to Skill
      const edgeId = `${ev.projectId}->${ev.skillId}`;
      if (!edges.some((e) => e.id === edgeId)) {
        edges.push({
          id: edgeId,
          source: ev.projectId,
          target: ev.skillId,
          relation: 'demonstrates',
        });
      }

      // 3. File Node if present
      if (ev.sourceLocation.filePath) {
        const fileNodeId = `file_${ev.sourceLocation.filePath}`;
        if (!addedNodeIds.has(fileNodeId)) {
          nodes.push({
            id: fileNodeId,
            label: ev.sourceLocation.filePath.split('/').pop() || ev.sourceLocation.filePath,
            type: 'file',
            subtext: ev.sourceLocation.filePath,
            projectId: ev.projectId,
          });
          addedNodeIds.add(fileNodeId);

          edges.push({
            id: `${ev.projectId}->${fileNodeId}`,
            source: ev.projectId,
            target: fileNodeId,
            relation: 'contains',
          });
        }
      }
    });

    return { nodes, edges };
  }
}
