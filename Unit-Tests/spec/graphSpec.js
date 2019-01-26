describe('Chart Tests', function() {
    var ndx = crossfilter();
    describe('pieChart1', function() {
        it('should exist', function() {
            expect(show_user_per_platform_average(ndx)).not.toBeNull();
        });

        it('should have chart', function() {
            expect(dc.pieChart("#users-balance")).toBeTruthy();
        });

        it('should have a width', function() {
            expect(dc.pieChart("#users-balance").width()).toEqual(200);
        });

        it('should have a height', function() {
            expect(dc.pieChart("#users-balance").height()).toEqual(200);
        });

        it('should be responsive', function() {
            expect(dc.pieChart("#users-balance").useViewBoxResizing(true)).toBeTruthy();
        });
    });
});