/**
 * Tests for Evident ProofGraph
 */

import { ProofGraph } from '../domain/proofGraph';
import { GOLDEN_PROJECTS, GOLDEN_EVIDENCE } from '../domain/fixtures';
import { ProjectSource, EvidenceItem } from '../domain/types';

describe('ProofGraph', () => {
  let graph: ProofGraph;

  beforeEach(() => {
    graph = new ProofGraph(GOLDEN_PROJECTS, GOLDEN_EVIDENCE);
  });

  it('initializes with candidate golden projects and evidence', () => {
    expect(graph.getProjects().length).toBe(GOLDEN_PROJECTS.length);
    expect(graph.getEvidence().length).toBe(GOLDEN_EVIDENCE.length);
  });

  it('correctly retrieves evidence items for a specific project', () => {
    const evidentEvidence = graph.getEvidenceForProject('proj_evident');
    expect(evidentEvidence.length).toBeGreaterThan(0);
    expect(evidentEvidence.every((e) => e.projectId === 'proj_evident')).toBe(true);
  });

  it('filters evidence by skill query', () => {
    const tsEvidence = graph.getEvidenceForSkill('typescript');
    expect(tsEvidence.length).toBeGreaterThan(0);
    expect(tsEvidence[0].skillName).toContain('TypeScript');
  });

  it('extracts distinct skills with accurate frequency counts', () => {
    const skills = graph.getDistinctSkills();
    expect(skills.length).toBeGreaterThan(0);
    const pythonSkill = skills.find((s) => s.name.toLowerCase().includes('python'));
    expect(pythonSkill).toBeDefined();
    expect(pythonSkill!.count).toBeGreaterThanOrEqual(1);
  });

  it('generates a connected visual graph structure with nodes and edges', () => {
    const visual = graph.generateVisualGraph();
    expect(visual.nodes.length).toBeGreaterThan(0);
    expect(visual.edges.length).toBeGreaterThan(0);

    // Verify project nodes exist
    const projectNodes = visual.nodes.filter((n) => n.type === 'project');
    expect(projectNodes.length).toBe(GOLDEN_PROJECTS.length);

    // Verify skill nodes exist
    const skillNodes = visual.nodes.filter((n) => n.type === 'skill');
    expect(skillNodes.length).toBeGreaterThan(0);

    // Verify file nodes exist
    const fileNodes = visual.nodes.filter((n) => n.type === 'file');
    expect(fileNodes.length).toBeGreaterThan(0);
  });

  it('supports dynamically adding a new project and updating relationships', () => {
    const newProj: ProjectSource = {
      id: 'proj_custom',
      name: 'CUSTOM_GATEWAY',
      description: 'Custom proxy layer',
      primaryLanguage: 'Go',
      languages: ['Go'],
      frameworks: ['Gin'],
      totalCommits: 12,
      candidateCommits: 12,
      isForkOrTemplate: false,
      lastUpdated: '2026-09-25',
      files: ['main.go'],
      evidenceIds: [],
    };

    graph.addProject(newProj);
    expect(graph.getProjects().length).toBe(GOLDEN_PROJECTS.length + 1);
    expect(graph.getProjects().some((p) => p.id === 'proj_custom')).toBe(true);
  });

  it('prevents duplicate edges when generating the visual graph', () => {
    const visual = graph.generateVisualGraph();
    const edgeIds = visual.edges.map((e) => e.id);
    const uniqueEdgeIds = new Set(edgeIds);
    expect(edgeIds.length).toBe(uniqueEdgeIds.size);
  });
});
