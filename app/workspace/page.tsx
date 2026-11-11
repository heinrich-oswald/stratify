"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

type SourceEntry = {
  id: number;
  title: string;
  type: "Primary" | "Secondary";
  note: string;
};

const starterPrompt = "I want to build a student project planner that helps with problem definition, research, milestones, and reflection.";

const initialSources: SourceEntry[] = [
  {
    id: 1,
    title: "Community survey findings",
    type: "Primary",
    note: "Users named clarity and confidence as the biggest blockers.",
  },
  {
    id: 2,
    title: "Best-practice project planning checklist",
    type: "Secondary",
    note: "Useful as a comparison reference for milestones and reflections.",
  },
];

const stageDefinitions = [
  {
    id: "discover",
    title: "Stage 1 — Discover",
    status: "In progress",
    goal: "Identify interests, problems and possible project connections.",
    outputs: ["Brainstorm list", "candidate topics", "personal-interest notes"],
    tasks: ["Map your interests", "List the strongest ideas", "Narrow toward a direction"],
  },
  {
    id: "define",
    title: "Stage 2 — Define",
    status: "Ready",
    goal: "Shape the learning goal and product goal before moving forward.",
    outputs: ["learning goal", "intended product", "target audience"],
    tasks: ["Write the learning goal", "Define the product goal", "Confirm boundaries"],
  },
  {
    id: "research",
    title: "Stage 3 — Research",
    status: "Ready",
    goal: "Plan and conduct research with evidence that can be checked later.",
    outputs: ["research questions", "source records", "notes", "source evaluation"],
    tasks: ["Research questions", "Source shortlist", "Compare key findings"],
  },
  {
    id: "success-criteria",
    title: "Stage 4 — Success Criteria",
    status: "Not started",
    goal: "Define measurable quality indicators linked to the final product.",
    outputs: ["quality criteria", "testing method", "rationale"],
    tasks: ["Define the criteria", "Specify measurable targets", "Note validation method"],
  },
  {
    id: "plan",
    title: "Stage 5 — Plan",
    status: "Not started",
    goal: "Turn the project into a realistic sequence of milestones and tasks.",
    outputs: ["timeline", "dependencies", "risks", "contingency plan"],
    tasks: ["List milestones", "Set target dates", "Flag risks"],
  },
  {
    id: "build",
    title: "Stage 6 — Build",
    status: "Not started",
    goal: "Create the product in manageable iterations with visible progress.",
    outputs: ["task checklist", "work log", "version notes"],
    tasks: ["Break work into steps", "Start version one", "Track blockers"],
  },
  {
    id: "test",
    title: "Stage 7 — Test",
    status: "Not started",
    goal: "Check the product against the success criteria and collect feedback.",
    outputs: ["test plan", "results", "issues", "feedback notes"],
    tasks: ["Draft the test plan", "Run the checks", "Capture key issues"],
  },
  {
    id: "improve",
    title: "Stage 8 — Improve",
    status: "Not started",
    goal: "Apply evidence from testing to improve the final outcome.",
    outputs: ["prioritised fixes", "retest notes", "before-after review"],
    tasks: ["List fix priorities", "Apply selected changes", "Retest key paths"],
  },
  {
    id: "report",
    title: "Stage 9 — Report",
    status: "Not started",
    goal: "Organise evidence and prepare a clear, honest final report.",
    outputs: ["report outline", "evidence map", "citations", "draft sections"],
    tasks: ["Map evidence to criteria", "Draft sections", "Review references"],
  },
  {
    id: "reflect",
    title: "Stage 10 — Reflect & Submit",
    status: "Not started",
    goal: "Reflect honestly on the process and confirm everything is ready to submit.",
    outputs: ["reflection prompts", "final checklist", "project archive"],
    tasks: ["Review process", "Confirm final checklist", "Prepare submission"],
  },
];

const workspaceItems = [
  { label: "My plans", value: "03 active" },
  { label: "Project setup", value: "In progress" },
  { label: "AI studio", value: "Ready" },
];

const initialTaskState = Object.fromEntries(
  stageDefinitions.map((stage) => [
    stage.id,
    stage.tasks.map((_, index) => (stage.id === "discover" && index === 0 ? true : false)),
  ]),
);

export default function WorkspacePage() {
  const [selectedStageId, setSelectedStageId] = useState(stageDefinitions[0].id);
  const [taskState, setTaskState] = useState<Record<string, boolean[]>>(initialTaskState);
  const [aiPrompt, setAiPrompt] = useState(starterPrompt);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    "Define the core problem your idea solves before picking features.",
    "Turn each milestone into a simple deliverable and evidence checkpoint.",
    "Review assumptions early with a short user or expert feedback loop.",
  ]);
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceType, setSourceType] = useState<"Primary" | "Secondary">("Primary");
  const [sources, setSources] = useState<SourceEntry[]>(initialSources);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedStage = useMemo(
    () => stageDefinitions.find((stage) => stage.id === selectedStageId) ?? stageDefinitions[0],
    [selectedStageId],
  );

  const totalTasks = stageDefinitions.reduce((total, stage) => total + stage.tasks.length, 0);
  const completedTasks = Object.values(taskState).reduce(
    (total, tasks) => total + tasks.filter(Boolean).length,
    0,
  );
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const toggleTask = (stageId: string, taskIndex: number) => {
    setTaskState((current) => {
      const nextStageTasks = [...(current[stageId] ?? [])];
      nextStageTasks[taskIndex] = !nextStageTasks[taskIndex];

      return {
        ...current,
        [stageId]: nextStageTasks,
      };
    });
  };

  const handleGenerateIdeas = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai/brainstorm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          context: selectedStage.title,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to generate ideas right now.");
      }

      setAiSuggestions(data.suggestions ?? aiSuggestions);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to generate ideas right now.";
      setAiSuggestions([message]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSource = () => {
    const trimmedTitle = sourceTitle.trim();

    if (!trimmedTitle) {
      return;
    }

    setSources((current) => [
      {
        id: Date.now(),
        title: trimmedTitle,
        type: sourceType,
        note: "Saved for fact-checking and later citation review.",
      },
      ...current,
    ]);
    setSourceTitle("");
    setSourceType("Primary");
  };

  return (
    <main className={styles.workspacePage}>
      <section className={styles.workspaceShell}>
        <header className={styles.workspaceHeader}>
          <div>
            <p className={styles.kicker}>Private workspace</p>
            <h1>Founder workspace</h1>
          </div>
          <button type="button" className={styles.primaryButton}>
            New plan
          </button>
        </header>

        <div className={styles.workspaceGrid}>
          {workspaceItems.map((item) => (
            <article key={item.label} className={styles.workspaceCard}>
              <p className={styles.cardEyebrow}>{item.label}</p>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>

        <section className={styles.progressPanel} aria-label="Project progress overview">
          <div>
            <p className={styles.kicker}>Journey overview</p>
            <h2>10-stage project plan</h2>
          </div>
          <div className={styles.progressMeta}>
            <strong>{progressPercent}% complete</strong>
            <span>
              {completedTasks} of {totalTasks} tasks checked
            </span>
          </div>
        </section>

        <div className={styles.stageLayout}>
          <nav aria-label="Project stages" className={styles.stageNav}>
            {stageDefinitions.map((stage) => {
              const isSelected = selectedStageId === stage.id;
              const checkedCount = taskState[stage.id]?.filter(Boolean).length ?? 0;

              return (
                <button
                  key={stage.id}
                  type="button"
                  className={`${styles.stageButton} ${isSelected ? styles.stageButtonSelected : ""}`}
                  onClick={() => setSelectedStageId(stage.id)}
                  aria-pressed={isSelected}
                >
                  <span>{stage.title}</span>
                  <small>
                    {checkedCount}/{stage.tasks.length} done
                  </small>
                </button>
              );
            })}
          </nav>

          <section className={styles.stagePanel} aria-live="polite">
            <div className={styles.stageHeader}>
              <div>
                <p className={styles.kicker}>Current stage</p>
                <h2>{selectedStage.title}</h2>
              </div>
              <span className={styles.stageStatus}>{selectedStage.status}</span>
            </div>

            <p className={styles.stageGoal}>{selectedStage.goal}</p>

            <div className={styles.outputGrid}>
              <div>
                <h3>Outputs</h3>
                <ul>
                  {selectedStage.outputs.map((output) => (
                    <li key={output}>{output}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Checklist</h3>
                <div className={styles.taskList}>
                  {selectedStage.tasks.map((task, index) => (
                    <label key={task} className={styles.taskItem}>
                      <input
                        type="checkbox"
                        checked={taskState[selectedStage.id]?.[index] ?? false}
                        onChange={() => toggleTask(selectedStage.id, index)}
                      />
                      <span>{task}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className={styles.aiPanel} aria-label="AI studio">
          <div className={styles.aiHeader}>
            <div>
              <p className={styles.kicker}>AI studio</p>
              <h3>Idea and planning support</h3>
            </div>
            <button type="button" className={styles.primaryButton} onClick={handleGenerateIdeas} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate ideas"}
            </button>
          </div>

          <textarea
            className={styles.aiInput}
            value={aiPrompt}
            onChange={(event) => setAiPrompt(event.target.value)}
            rows={4}
            placeholder="Describe your project idea or question..."
          />

          <ul className={styles.aiSuggestions}>
            {aiSuggestions.map((suggestion) => (
              <li key={suggestion}>{suggestion}</li>
            ))}
          </ul>
        </section>

        <section className={styles.researchPanel} aria-label="Research library">
          <div className={styles.aiHeader}>
            <div>
              <p className={styles.kicker}>Research library</p>
              <h3>Research library</h3>
            </div>
          </div>

          <div className={styles.researchLayout}>
            <div className={styles.researchCard}>
              <label htmlFor="source-title" className={styles.fieldLabel}>
                Source title
              </label>
              <input
                id="source-title"
                type="text"
                value={sourceTitle}
                onChange={(event) => setSourceTitle(event.target.value)}
                placeholder="Interview with a local teacher"
                className={styles.textInput}
              />

              <label htmlFor="source-type" className={styles.fieldLabel}>
                Source type
              </label>
              <select
                id="source-type"
                value={sourceType}
                onChange={(event) => setSourceType(event.target.value as "Primary" | "Secondary")}
                className={styles.textInput}
              >
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
              </select>

              <button type="button" className={styles.primaryButton} onClick={handleSaveSource}>
                Save source
              </button>
            </div>

            <div className={styles.sourceList}>
              {sources.map((source) => (
                <article key={source.id} className={styles.sourceCard}>
                  <div className={styles.sourceMetaRow}>
                    <h4>{source.title}</h4>
                    <span>{source.type}</span>
                  </div>
                  <p>{source.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
