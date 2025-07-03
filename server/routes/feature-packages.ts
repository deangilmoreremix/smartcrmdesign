import { Router } from 'express';
import { eq, desc } from 'drizzle-orm';
import { db } from '../db';
import { 
  featurePackages, 
  insertFeaturePackageSchema,
  type FeaturePackage,
  type InsertFeaturePackage
} from '@shared/schema';

const router = Router();

// Get all feature packages
router.get('/', async (req, res) => {
  try {
    const packages = await db
      .select()
      .from(featurePackages)
      .where(eq(featurePackages.isActive, true))
      .orderBy(desc(featurePackages.createdAt));

    res.json(packages);
  } catch (error) {
    console.error('Error fetching feature packages:', error);
    res.status(500).json({ error: 'Failed to fetch feature packages' });
  }
});

// Get specific feature package
router.get('/:packageId', async (req, res) => {
  try {
    const { packageId } = req.params;

    const pkg = await db
      .select()
      .from(featurePackages)
      .where(eq(featurePackages.id, packageId))
      .limit(1);

    if (pkg.length === 0) {
      return res.status(404).json({ error: 'Feature package not found' });
    }

    res.json(pkg[0]);
  } catch (error) {
    console.error('Error fetching feature package:', error);
    res.status(500).json({ error: 'Failed to fetch feature package' });
  }
});

// Create new feature package
router.post('/', async (req, res) => {
  try {
    const validatedData = insertFeaturePackageSchema.parse(req.body);
    
    const [newPackage] = await db
      .insert(featurePackages)
      .values(validatedData)
      .returning();

    res.status(201).json(newPackage);
  } catch (error) {
    console.error('Error creating feature package:', error);
    res.status(500).json({ error: 'Failed to create feature package' });
  }
});

// Update feature package
router.patch('/:packageId', async (req, res) => {
  try {
    const { packageId } = req.params;
    const validatedData = insertFeaturePackageSchema.partial().parse(req.body);

    const [updatedPackage] = await db
      .update(featurePackages)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(featurePackages.id, packageId))
      .returning();

    if (!updatedPackage) {
      return res.status(404).json({ error: 'Feature package not found' });
    }

    res.json(updatedPackage);
  } catch (error) {
    console.error('Error updating feature package:', error);
    res.status(500).json({ error: 'Failed to update feature package' });
  }
});

// Delete feature package
router.delete('/:packageId', async (req, res) => {
  try {
    const { packageId } = req.params;

    // Soft delete by setting isActive to false
    const [deletedPackage] = await db
      .update(featurePackages)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(featurePackages.id, packageId))
      .returning();

    if (!deletedPackage) {
      return res.status(404).json({ error: 'Feature package not found' });
    }

    res.json({ message: 'Feature package deleted successfully' });
  } catch (error) {
    console.error('Error deleting feature package:', error);
    res.status(500).json({ error: 'Failed to delete feature package' });
  }
});

export default router;