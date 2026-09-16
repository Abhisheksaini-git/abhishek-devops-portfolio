/**
 * Conversational Context Manager for DevOps Knowledge Assistant
 * Tracks topic progression, previous entities, and resolves pronouns/follow-ups.
 */

export class ConversationContext {
  constructor() {
    this.currentTopic = null;
    this.previousTopic = null;
    this.currentDomain = null;
    this.history = [];
  }

  setTopic(domain, id, title, keywords = []) {
    this.previousTopic = this.currentTopic;
    this.currentTopic = { id, title, domain, keywords: Array.isArray(keywords) ? keywords : [keywords] };
    this.currentDomain = domain;
  }

  getLastTopic() {
    return this.currentTopic;
  }

  recordTurn(userInput, detectedTopic, domain) {
    if (detectedTopic) {
      this.previousTopic = this.currentTopic;
      this.currentTopic = detectedTopic;
      this.currentDomain = domain || this.currentDomain;
    }
    this.history.push({
      input: userInput,
      topic: this.currentTopic,
      domain: this.currentDomain,
      timestamp: Date.now()
    });
    if (this.history.length > 20) {
      this.history.shift();
    }
  }

  resolveContextualQuery(query) {
    const raw = query.toLowerCase().trim();
    const cleanQ = raw.replace(/[?.,!]/g, '').trim();

    if (!this.currentTopic) {
      return { resolvedQuery: raw, followUpType: null };
    }

    const primaryKey = (this.currentTopic.keywords && this.currentTopic.keywords[0]) || this.currentTopic.title || this.currentTopic.id;

    // Pronoun / reference patterns
    const isWhyNeedIt = /^(why (should (we|i)|do we|do i|to) (use|need) (it|this)|why (it|this)|why need (it|this))$/i.test(cleanQ);
    const isHowItWorks = /^(how does (it|this) work|how (it|this) works|how does this operate)$/i.test(cleanQ);
    const isExplainMore = /^(tell me more( about it)?|explain more|elaborate|details)$/i.test(cleanQ);
    const isHowToFix = /^(how to fix( it| this)?|how do (i|we) fix (it|this)|fix it)$/i.test(cleanQ);
    const isCompareThem = /^(compare them|comparison|difference between them|whats the difference|what is the difference)$/i.test(cleanQ);
    const isWhatAbout = /^what about ([a-z0-9\s._-]+)$/i.exec(cleanQ);

    if (isWhyNeedIt) {
      return {
        resolvedQuery: primaryKey,
        followUpType: 'WHY_USE'
      };
    }

    if (isHowItWorks) {
      return {
        resolvedQuery: primaryKey,
        followUpType: 'HOW_WORKS'
      };
    }

    if (isHowToFix) {
      return {
        resolvedQuery: primaryKey,
        followUpType: 'HOW_TO_FIX'
      };
    }

    if (isExplainMore) {
      return {
        resolvedQuery: primaryKey,
        followUpType: 'EXPLAIN_MORE'
      };
    }

    if (isCompareThem && this.previousTopic && this.currentTopic) {
      const prevKey = (this.previousTopic.keywords && this.previousTopic.keywords[0]) || this.previousTopic.title;
      return {
        resolvedQuery: `${prevKey} vs ${primaryKey}`,
        followUpType: 'COMPARE_TOPICS'
      };
    }

    if (isWhatAbout && isWhatAbout[1]) {
      const candidate = isWhatAbout[1].trim();
      return {
        resolvedQuery: candidate,
        followUpType: 'SWITCH_TOPIC'
      };
    }

    return { resolvedQuery: raw, followUpType: null };
  }

  reset() {
    this.currentTopic = null;
    this.previousTopic = null;
    this.currentDomain = null;
    this.history = [];
  }
}

export const contextManager = new ConversationContext();
