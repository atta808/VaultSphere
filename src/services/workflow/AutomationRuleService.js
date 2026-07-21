import AutomationRuleRepository from '../../database/repositories/workflow/AutomationRuleRepository';


class AutomationRuleService {
  async triggerEvent(eventType, context) {
    const rules = await AutomationRuleRepository.findActiveByEventType(eventType);

    for (const rule of rules) {
       // evaluate condition
       // execute action
    }
  }
}

export default new AutomationRuleService();
