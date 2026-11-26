/* MCG AI Readiness Assessment: scoring (pure functions, no interface code)
   - each answer scores 0 to 3 in the order listed (first = 0, last = 3)
   - dimension score = points earned / maximum points x 100, rounded
   - overall score   = average of the five dimension scores, rounded
   - level by overall: under 40, 40 to 59, 60 to 79, 80 and above
   - tier per dimension: under 40 start, 40 to 74 build, 75 and above advance */
(function (root) {
  function levelIndex(overall) { return overall < 40 ? 0 : overall < 60 ? 1 : overall < 80 ? 2 : 3; }
  function tierFor(score) { return score < 40 ? 'start' : score < 75 ? 'build' : 'advance'; }

  /* sizes: questions per dimension, e.g. [3,3,3,3,3]; answers: one value 0-3 per question, in order */
  function scoreAssessment(sizes, answers) {
    var i = 0, dims = sizes.map(function (n, d) {
      var pts = 0;
      for (var k = 0; k < n; k++) { var a = answers[i++]; pts += (a >= 0 && a <= 3) ? a : 0; }
      var score = Math.round(pts / (n * 3) * 100);
      return { index: d, score: score, tier: tierFor(score) };
    });
    var overall = Math.round(dims.reduce(function (s, d) { return s + d.score; }, 0) / dims.length);
    /* weakest first; ties keep the original dimension order */
    var order = dims.slice().sort(function (a, b) { return a.score - b.score || a.index - b.index; }).map(function (d) { return d.index; });
    return { dims: dims, overall: overall, level: levelIndex(overall), order: order };
  }

  var api = { scoreAssessment: scoreAssessment, levelIndex: levelIndex, tierFor: tierFor };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.MCGScoring = api;
})(this);
