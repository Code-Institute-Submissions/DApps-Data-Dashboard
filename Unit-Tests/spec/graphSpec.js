describe("Chart Tests", function() {
    var ndx = crossfilter();
    // Build pieChart1
    function buildChart(id) {
      var pieChart1 = dc.pieChart("#" + id);
      pieChart1
        .dimension(dappDim)
        .group(averageUsersPerPlatform)
        .width(200)
        .height(200)
        .innerRadius(30)
        .transitionDuration(900);
      pieChart1.render();
      return pieChart1;
    }

    var dappDim = ndx.dimension(dc.pluck("platform"));
    var averageUsersPerPlatform = dappDim.group().reduce(
      function(p, v) {
        p.count++;
        p.total += v.users_24hr;
        return p;
      },
      function(p, v) {
        p.count--;
        if (p.count == 0) {
          p.total = 0;
        } else {
          p.total -= v.users_24hr;
        }
        return p;
      },
      function() {
        return { count: 0, total: 0 };
      }
    );

    describe("pieChart1", function() {
      var pieChart1;
      beforeEach(function() {
        pieChart1 = buildChart("users-balance");
        pieChart1.dimension();
        pieChart1.render();
      });
      it("should exist", function() {
        expect(show_user_per_platform_average(ndx)).not.toBeNull();
      });

      it("should have chart", function() {
        expect(dc.hasChart(pieChart1)).toBeTruthy();
      });

      it("should have a width", function() {
        expect(pieChart1.width()).toEqual(200);
      });

      it("should have a height", function() {
        expect(pieChart1.height()).toEqual(200);
      });

      it("should have an innerRadius", function() {
        expect(pieChart1.innerRadius()).toEqual(30);
      });

      it("should be responsive", function() {
        expect(pieChart1.useViewBoxResizing(true)).toBeTruthy();
      });
  });
});