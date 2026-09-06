import sys
import os

def test_api():
    print("Testing VrikshaSetu Backend Services...")
    try:
        from app.models.database import SessionLocal, Tree, PlantationDrive, Guardian, Reward
        from app.services.cv_engine import analyze_sapling_photo, compute_dhash, calculate_haversine_distance
        from PIL import Image
        import io

        db = SessionLocal()
        trees_count = db.query(Tree).count()
        drives_count = db.query(PlantationDrive).count()
        guardians_count = db.query(Guardian).count()
        rewards_count = db.query(Reward).count()

        print(f"[PASS] Database Check: {trees_count} trees, {drives_count} drives, {guardians_count} guardians, {rewards_count} rewards.")
        assert trees_count >= 20, "Expected at least 20 trees seeded"

        # Test CV Analysis with a green test image
        img = Image.new('RGB', (100, 100), color=(34, 139, 34)) # Forest green
        buf = io.BytesIO()
        img.save(buf, format='PNG')
        buf.seek(0)
        
        cv_result = analyze_sapling_photo(buf.getvalue())
        print(f"[PASS] AI CV Engine Check: ExG survival score = {cv_result['survival_score']}%, status = {cv_result['health_status']}")
        assert cv_result['survival_score'] >= 80.0, "Expected healthy score for vibrant green image"

        # Test Haversine distance
        dist = calculate_haversine_distance(22.8056, 86.1950, 22.8058, 86.1952)
        print(f"[PASS] Geofencing Engine Check: Distance calculated = {dist}m")
        assert 0 < dist < 50, "Distance calculation within expected range"

        db.close()
        print("\n[SUCCESS] ALL BACKEND VERIFICATIONS PASSED SUCCESSFULLY!")
        return True
    except Exception as e:
        print(f"[FAIL] Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    if not test_api():
        sys.exit(1)
