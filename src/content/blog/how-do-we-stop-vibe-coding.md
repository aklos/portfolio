---
title: "How Do We Stop Vibe Coding?"
date: "2026-07-24"
description: "Coding agents won the workflow war, but nobody trusts their output. Why specs, skills, and TDD haven't fixed it — and what might."
toc: true
---

When Claude Code blew up in popularity near the end of December 2025, a large portion of software developers quickly shifted to using coding agents as part of their main development workflows.

Andrej Karpathy, who coined the term "vibe coding," stated on the No Priors podcast in March 2026:

> I don't think I've typed like a line of code probably since December, basically, which is an extremely large change. I don't think a normal person actually realizes that this happened or how dramatic it was.

I believe him. A lot of people say this is just marketing or hype, but as someone who also hasn't written a single line of code since last year, I think he's being honest here. Now, whether that's good or bad depends on your perspective, but there's no doubt that we've entered a new era of software engineering.

Despite the quick adoption of agents, there's a general anxiety growing among the practitioners, and the people watching their output: will the tidal wave of slop ever end? Are we destroying ourselves for the sake of convenience here? How do we stop this?

## Intent Above Code

Grady Booch, co-creator of UML, actually [argues](https://www.youtube.com/watch?v=OfMAtaocvJw) that we're in the third golden age of software engineering:

- The first, from the late 1940's to the 1970's, was the age of the algorithm. High-level languages and compilers abstracted away the machine.
- The second, from the 1970's to the 2000's, was the age of object-oriented abstraction.
- The third, starting around 2000, is the age of systems: libraries, platforms, and APIs abstracting away entire subsystems.

Booch is careful to note that this third age wasn't started by AI, just accelerated by it. But he also compares AI coding agents to the arrival of compilers in Grace Hopper's time, and that's the comparison that matters here. Compilers abstracted away the machine. Agents abstract away the code itself.

We can now, for the first time ever, generate code by capturing full intent. The lack of this ability was what killed model-driven development back in the day (think what you will about UML, but maybe it's time we thought about bringing MDD back in some form.)

Practically, as we move up in abstraction towards intent we lose many of the tools and methods that made working with code a reliable process. If we can adapt, I believe that this shift could potentially not just speed up development, but also vastly improve the quality of software solutions.

Currently however, we're stuck in the vibe coding casino. Everyone and their grandma is now churning out code like there's no tomorrow, pulling the lever and hoping for the best.

## The Problem

Vibe coding has almost universally been described as (a) damaging to personal understanding of solutions and architecture, and (b) unreliable because of under-specified prompts, the natural language interface being lossy, and non-deterministic code generation.

When you're vibe coding:

- You stop understanding the codebases you're working in. The mental model that gets built is vague and mostly reliant on your own previous experience as a programmer.
    - You lose awareness of dead/redundant code and stubs.
    - You lose track of what was implemented and why.
    - You can't explain the architecture to others, or reason about potential problems.
- You have almost no visibility of what will change before you approve a plan. Yes, the agent usually writes a little essay explaining what it will do, but it's limited.
    - It doesn't show a blast radius.
    - It doesn't tell you that it's only going to implement something partially, or that it omitted something crucial that you assumed was obvious.
    - Even if it does, you might not catch it because the plans have no learnable structure.

This is the black-box effect that slowly consumes your workflow and makes you less rigorous as a software engineer, until eventually you're blindly pushing commits and taking down production.

Even if you don't abuse coding agents this way and prefer to keep programming manually, it's hard to deny that this is probably the future of software engineering at large. We can see how many engineers are using coding agents as part of their core workflows, and how many 100x devs are already trying to create autonomous loops with them as if control and decision-making are merely distractions from the real goal: tokenmaxxing.

In any case, it boils down to trust; you can't trust your own understanding of the codebase, and you can't trust the agent did what you wanted it to do.

## The Solutions Are Immature

We all understand that this is bad - but what about potential solutions? There's a lot of discussion on this topic and yet I'd argue that nothing proposed so far is remotely compelling.

First, we need to agree on what we're even trying to do: we want to minimize, as much as possible, how much we need to trust the coding agent's output.

In support of that, we want:

1. **The agent to reliably do what we ask it to.** Ideally, deterministically - which might not be possible, but it's a good target.
2. **To be able to audit and track what it does to our codebase.** Ideally, without having to necessarily read the code.
3. **To keep friction to a minimum.** Vibe coding is winning because it's the path of least resistance, we need to accept that and make the disciplined path the easy one.

And none of the current solutions address the three points adequately. Most of them rely on, or flat out *are*, some variation of prompt engineering, which is *not* the same thing as intent distillation (#1.)

### Markdown Specs

Many engineers I talk to will launch into something like this:

> Well, I use markdown specs and coordinate an agent pipeline to review them, implement them as code, then manage and update them, and it reviews for consistency, checks against the existing codebase, flags anything that conflicts, then hands it off to implement, and once that's done it loops back and updates the spec so the docs and code never drift apart, so really the markdown is the source of truth and everything else just orbits around keeping it in sync...

As my eyes glaze over, I can't stop thinking:

- Do you have a system or structured format for these specs?
- How do you know which parts of the spec are actually implemented?
- How do you know if the code does anything other than what's specified?
- What agent pipeline? Do you have to remind it that your specs exist?
- Why wouldn't I just prompt the agent directly?

There are so many questions that fall out of this, and usually the answers to them are extremely vague - at which point this seems like a personal workflow optimization that has no verifiable impact. Whatever they're doing feels "rigorous" to them, that's it.

This is nicely exemplified by Addy Osmani's article from February 2026, ["How to Write a Good Spec for AI Agents"](https://www.oreilly.com/radar/how-to-write-a-good-spec-for-ai-agents/).

It's not vague, exactly - it's dense. Five principles, a six-section format, a study of 2,500 config files, every tool you've heard of name-dropped. It looks like a system. Then you realize the entire article is just describing prompt engineering in an agentic context.

We can't seriously call this spec-driven development, because the spec is not the "source of truth" but a guiding prompt. There's no enforcement mechanism, nor even a reconciliation mechanism beyond asking the agent "does the code follow the spec?" - which the AI can interpret any way it likes, because there's no shared syntax!

Fundamentally, markdown specs don't address the lack of trust we have with agents, and they're straight up annoying to manage. They must become clearly structured and placed within a larger system to be useful.

### Skills

These are essentially context/instructions you inject conditionally, depending on the task. While they can be useful, they still fully rely on the agent to follow, which fails for our needs in the exact same way markdown specs do - even if they're much less finicky to implement.

Amusingly, they also tend to be obnoxious fluff, like this [gigantic "QA" skill](https://github.com/garrytan/gstack/blob/main/qa/SKILL.md) from gstack.

I'm pretty sure that prompting "find and fix bugs plz" would get the job done just as well (or better?) with most agents.

Skills are supplemental at best, as prompt engineering.

### [Spec Kit](https://github.com/github/spec-kit) & [OpenSpec](https://github.com/Fission-AI/openspec), etc.

Spec Kit is a directory of markdown templates that a CLI drops into your project. You're supposed to run six commands in order: specify → clarify → plan → tasks → analyze → implement.

Behind the scenes the agent is being guided to define everything according to the templates and then keep the outputs around as context for later prompts.

This is *almost* a start, because it tries to apply some kind of process to vibe coding, and loosely defines a structure for the coding agent to follow. The key word being "loose," and the problem being that the developer is the one driving the entire process - six commands where there was one - while still being unable to actually **see** anything.

OpenSpec is a lighter take on the same idea: explore → propose → apply → archive instead of the six-command pipeline, and plain-markdown WHEN/THEN scenarios instead of Kiro's EARS. It makes the identical bet, and fails the identical way: you drive the process, the agent grades its own homework, but nothing mechanical checks spec against code.

There are dozens of these projects and they're all basically the same.

### [Kiro](https://kiro.dev/)

Attempts to systematize feature development by steering agents to use markdown specs with EARS requirements, through hooks.

If you don't know what EARS (Easy Approach to Requirements Syntax) is, here are a couple of examples showing natural language requirements vs. EARS requirements:

| Natural language | EARS |
| --- | --- |
| Users should get logged out after a while if they're inactive, for security reasons. | WHEN a user session has been inactive for 15 minutes, the system SHALL terminate the session and redirect the user to the login page. |
| Handle failed payments gracefully. | IF a payment attempt fails, THEN the system SHALL preserve the cart contents and display the reason for the failure. |

The use of EARS here is interesting because it's helpful to both the agent and the developer, by formulating requirements in a more structured way than pure prose. When you're working with intent, using unstructured prose will quickly make you go cross-eyed; you just can't scan it the same way you would code. EARS helps with that.

Implementing hooks is also a good move, forcing the agent to react to triggers and explicitly follow the steps of their process. It's not deterministic, but it's structure.

Sadly, Kiro falls apart in two ways:

- Feature specs accumulate, they don't compose; so there's no auditable graph.
- Nothing ever reconciles the requirements against shipped code; it builds the courtroom and never holds the trial.

### Test-Driven Development

A test's name is a description of intent; a business or process requirement that must be fulfilled by the code, written in natural language. The test itself is an anchor to the real code that hopefully proves that the code aligns with said intent. Higher-level tests can even act as functional dependency graphs, in that sense.

Finally some semblance of deterministic enforcement. This can actually help!

However, devs usually make the agent write the tests, because it's just easier, but this re-introduces the same problems we're trying to fix.

The other approach is manually writing the tests, but then you'd have to know the code's implementation - and you'd have to write code, which I think is an issue if we're talking about abstracting the code away. I don't mean that writing your own tests is wrong, but this article is about how to fix vibe coding, specifically. We, as coding agent enjoyers, would prefer to stay at the level of intent rather than implementation as much as possible.

> *Side note:* CodeSpeak - more on it below - recently ran into this exact problem: the original thesis was that devs would write the spec files manually, but most of the alpha testers made their agents do it instead. They've since pivoted to automatically extracting structured intent from natural language prompts.

So, we have to come back around: TDD solves part of the problem, but only if we can constrain how the agent writes the tests, or generate them deterministically.

## Jigsaw Falling Into Place

The previous solutions are inadequate because they don't address the core problem: trust.

Yes, they attempt to better align agents to our intent. They try to give an operating procedure to the agent. They even have some basic notion of keeping a history of changes, or tightening the harness (as in the use of hooks.)

But it's still a prompt interface - with added ritual as discipline - and reading prose or code. They don't reveal the full picture of what you're working on. They don't enforce that the agent implements what you defined, or even what the agent says it implemented. They don't provide a shared surface that both the developer and the agent agree on.

And solving this is genuinely hard. It's telling that [Tessl](https://tessl.io/) - which raised $125M on the promise of spec-driven development - has quietly steered away from selling SDD to developers and toward "skills are the new code." Oops?

Luckily, the space is evolving and the pieces of the puzzle are starting to come together into solutions that might actually work.

The following two projects (disclaimer: one of them is mine) are at least heading in the right direction to address the real issues we have with vibe coding.

*FWIW, these are the only projects I actually know of that focus on the trust problem, but if there are others I'd love to hear about them.*

### [CodeSpeak](https://codespeak.dev/)

Started by Andrey Breslav, the creator of Kotlin.

CodeSpeak bets trust can be compiled away: you write concise markdown specs, organized into modules that import each other, and `codespeak build` compiles them into working code - Python, Go, or TypeScript you're not really meant to review. The toolchain takes the "compiler" framing seriously: specs are validated for consistency before a build, tests run after it, and `codespeak takeover` can even reverse-generate specs from an existing codebase.

Since the pivot I mentioned earlier, they've also been building a requirements layer on top: conversations with your agent get distilled into structured requirements, mapped to the code files that implement them, with drift flagged when a change diverges. And they're still working on formalizing the spec language itself, aiming for builds that are deterministic, or close to it.

### [Scryer](https://github.com/aklos/scryer)

I've been working on this tool for the past six months, iterating on it to align with my own development workflows.

Scryer bets the opposite way: trust in the agent is irreducible, so it should be as cheap as possible to spend. It's model-driven development for coding agents. You and your agent share a model of the system: a C4-style hierarchy where each node states what it's responsible for in short, language-independent claims, mapped to the source lines that implement them and the tests that prove them. The agent reads and writes the model over MCP; you browse it as wiki-style pages and diagrams instead of reading code.

The model leads; the code follows. You plan a change, and the plan shows as a git-style diff over the entire model. There's your blast radius. Underneath sits a deterministic observability layer reporting what's built versus planned, which claims are anchored and test-backed, and where the code has drifted from the model since the last reconcile.

## There's No Retreat

Modern software development is mostly re-implementing the same patterns over and over again, using standard solutions, and mixing & matching algorithms. That's what LLMs excel at - they're better at it than we are, and honestly why would we even want to do this manually? All it did was lead to burnout and cynicism.

Writing code by hand will always be around for bespoke and novel, complex work. Hopefully, many developers will slowly rediscover their love for programming when they can apply it to problems that actually interest and challenge them, for everything else we should try to make coding agents as reliable as possible.

Possibly, we'll stay as pilots for agents, or maybe autonomous agents will do most of the work soon. Either way, they'll need a spec - and prompt rituals dressed up as process won't cut it. We need to move past the current crop of half-solutions and onto tooling actually built for this: intent as a first-class artifact, checked against the code.

We can't go back to a world without coding agents and vibe coding, but we can rig the slot machine, and leave the casino.
