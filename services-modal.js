// ============================================================
// SERVICES: INDUSTRY + FULL SERVICE-DETAIL POPUP LOGIC
// Reads INDUSTRIES from services-data.js and renders:
//   1) the industry cards grid (#servicesGrid)
//   2) a full-page popup: industry -> service list -> full service brief
// ============================================================
(function () {
  if (typeof INDUSTRIES === "undefined") return;

  var grid = document.getElementById("servicesGrid");
  var overlay = document.getElementById("svcModalOverlay");
  var modal = document.getElementById("svcModal");
  var body = document.getElementById("svcModalBody");
  var closeBtn = document.getElementById("svcModalClose");

  if (!grid || !overlay || !modal || !body || !closeBtn) return;

  // ---------- open / close ----------
  function openModal() {
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  function setAccent(industry) {
    modal.style.setProperty("--accent", industry.color);
    modal.style.setProperty("--accent-soft", industry.soft);
  }
  function scrollModalTop() {
    modal.scrollTop = 0;
  }

  // ============================================================
  // CONTENT ENRICHMENT
  // Every service in services-data.js only stores: name, case,
  // plan (3 steps) and fulfill. Everything below expands that
  // into a full, sector-specific brief: overview, a longer case
  // study, a 6-step working process, deliverables, how it lines
  // up with the client's business, and a closing commitment —
  // without repeating the same wording industry to industry.
  // ============================================================

  var CLOSING_STEPS = [
    ["Share progress at every checkpoint, not just the end", "Hand over documentation and provide support after delivery"],
    ["Review results together and refine what's needed", "Stay available after delivery for follow-up questions"],
    ["Keep you updated at each stage so there are no surprises", "Wrap up with clear documentation and a proper handover"],
    ["Adjust the plan as real-world feedback comes in", "Provide after-delivery support so nothing is left half-finished"]
  ];

  var DELIVERABLE_TEMPLATES = [
    function (n) { return "A clear, written plan for " + n.toLowerCase() + " before any work begins"; },
    function (n) { return "Regular progress updates so you always know where things stand"; },
    function (n) { return "Documentation you can keep and reuse after the engagement ends"; },
    function (n) { return "A final review and handover, with support for questions afterward"; }
  ];

  var ALIGNMENT_OPENERS = [
    "This isn't handled in isolation — ",
    "The way I approach this is tied directly to your bigger picture — ",
    "I treat this as part of your overall business goals, not a standalone task — ",
    "This work is built to support what you're actually trying to achieve — "
  ];

  var ALIGNMENT_MIDDLES = [
    "every decision is checked against your budget, timeline and the outcome you actually need, ",
    "I keep this connected to your broader plans in {industry}, so it supports growth rather than sitting apart from it, ",
    "I weigh cost, speed and quality against what matters most to your business right now, ",
    "the priority is always what moves your business forward, not just what looks complete on paper, "
  ];

  var ALIGNMENT_CLOSERS = [
    "so the outcome fits into how your business actually runs day to day.",
    "so what gets delivered is something your team can use immediately, not shelve.",
    "so it strengthens the rest of your operations in {industry}, instead of working against them.",
    "so the result holds up under real business pressure, not just in a plan."
  ];

  var OVERVIEW_OPENERS = [
    "This is one of the areas I work in most closely within {industry}. ",
    "Within {industry}, this is a service I return to often because it tends to make an outsized difference. ",
    "This sits at the core of how I support businesses in {industry}. ",
    "This is a service I approach hands-on, not just as advisory, within {industry}. "
  ];

  function pick(arr, seed) {
    return arr[seed % arr.length];
  }

  function hashStr(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) {
      h = (h * 31 + s.charCodeAt(i)) >>> 0;
    }
    return h;
  }

  function fillIndustry(str, industryName) {
    return str.split("{industry}").join(industryName);
  }

  function buildOverview(industry, svc, seed) {
    var opener = fillIndustry(pick(OVERVIEW_OPENERS, seed), industry.name);
    return opener + svc.case;
  }

  function buildProcess(svc, seed) {
    var extra = pick(CLOSING_STEPS, seed);
    return svc.plan.concat(extra);
  }

  function buildDeliverables(svc) {
    return DELIVERABLE_TEMPLATES.map(function (fn) { return fn(svc.name); });
  }

  function buildAlignment(industry, svc, seed) {
    var opener = ALIGNMENT_OPENERS[seed % ALIGNMENT_OPENERS.length];
    var middle = fillIndustry(ALIGNMENT_MIDDLES[(seed + 1) % ALIGNMENT_MIDDLES.length], industry.name);
    var closer = fillIndustry(ALIGNMENT_CLOSERS[(seed + 2) % ALIGNMENT_CLOSERS.length], industry.name);
    return opener + middle + closer;
  }

  function buildFulfill(svc) {
    return svc.fulfill + " That's the standard I hold every delivery in this service to, from the first conversation to final handover.";
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  // ---------- render: industry -> service list ----------
  function renderIndustry(industry) {
    setAccent(industry);
    var rowsHtml = industry.services.map(function (svc, i) {
      return '<li class="svc-service-row" data-svc-index="' + i + '">' +
        "<span>" + escapeHtml(svc.name) + "</span><span class=\"svc-arrow\">\u203a</span></li>";
    }).join("");

    body.innerHTML =
      '<span class="svc-eyebrow">' + industry.icon + " " + escapeHtml(industry.name) + "</span>" +
      "<h2>" + escapeHtml(industry.name) + "</h2>" +
      '<p class="svc-pitch">' + escapeHtml(industry.pitch) + "</p>" +
      '<p class="svc-count">' + industry.services.length + ' services available in this sector — tap any to see the full brief.</p>' +
      '<ul class="svc-service-list">' + rowsHtml + "</ul>";

    var rows = body.querySelectorAll(".svc-service-row");
    rows.forEach(function (row) {
      row.addEventListener("click", function () {
        var idx = parseInt(row.getAttribute("data-svc-index"), 10);
        renderService(industry, industry.services[idx], idx);
      });
    });
    scrollModalTop();
  }

  // ---------- render: full service brief ----------
  function renderService(industry, svc, idx) {
    var seed = hashStr(industry.id + "::" + svc.name) + idx;

    var overview = buildOverview(industry, svc, seed);
    var processSteps = buildProcess(svc, seed);
    var deliverables = buildDeliverables(svc);
    var alignment = buildAlignment(industry, svc, seed);
    var fulfillFull = buildFulfill(svc);

    var processHtml = processSteps.map(function (s, i) {
      return '<li><span class="svc-step-num">' + (i + 1) + "</span><span>" + escapeHtml(s) + "</span></li>";
    }).join("");

    var deliverablesHtml = deliverables.map(function (d) {
      return "<li>" + escapeHtml(d) + "</li>";
    }).join("");

    body.innerHTML =
      '<button class="svc-back-btn" id="svcBackBtn">\u2039 Back to ' + escapeHtml(industry.name) + " services</button>" +
      '<span class="svc-eyebrow">' + industry.icon + " " + escapeHtml(industry.name) + "</span>" +
      "<h2>" + escapeHtml(svc.name) + "</h2>" +
      '<div class="svc-detail">' +
        "<h4>Overview</h4><p>" + escapeHtml(overview) + "</p>" +

        "<h4>Case Study</h4><p>" + escapeHtml(svc.case) + "</p>" +

        "<h4>How I Work On This</h4>" +
        '<ol class="svc-process-list">' + processHtml + "</ol>" +

        "<h4>What You Can Expect</h4>" +
        '<ul class="svc-deliverable-list">' + deliverablesHtml + "</ul>" +

        "<h4>How This Aligns With Your Business</h4><p>" + escapeHtml(alignment) + "</p>" +
      "</div>" +
      '<div class="svc-fulfill">' + escapeHtml(fulfillFull) + "</div>";

    document.getElementById("svcBackBtn").addEventListener("click", function () {
      renderIndustry(industry);
    });
    scrollModalTop();
  }

  // ---------- build the industry cards on the page ----------
  INDUSTRIES.forEach(function (industry) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "industry-card";
    card.style.setProperty("--accent", industry.color);
    card.innerHTML =
      '<span class="industry-icon">' + industry.icon + "</span>" +
      "<h3>" + escapeHtml(industry.name) + "</h3>" +
      "<p>" + escapeHtml(industry.pitch) + "</p>" +
      '<span class="industry-cta">' + industry.services.length + ' Services \u2192</span>';
    card.addEventListener("click", function () {
      renderIndustry(industry);
      openModal();
    });
    grid.appendChild(card);
  });
})();
