/*
* Progress Tracker Class
* An instance of Progress Tracker tracks progress of a multi-step process
*/

class ProgressTracker{
  constructor(onProgressAdvance){
    this.currentStep = 0;
    this.totalSteps = 0;
    this.onProgressAdvance = onProgressAdvance;
  }

  setTotalSteps(totalSteps){
    this.totalSteps = totalSteps;
  }

  advance(){
    this.currentStep++;
    this.onProgressAdvance(this.currentStep, this.totalSteps);
  }

}

export default ProgressTracker;
