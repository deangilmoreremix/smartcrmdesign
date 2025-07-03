import { createClient } from '@supabase/supabase-js';
import featureList from './featureList.json' assert { type: "json" };

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!
);

async function seedFeatures() {
  const { data, error } = await supabase
    .from('feature_access')
    .upsert(featureList, { onConflict: ['role', 'feature_name'] });

  if (error) {
    console.error('❌ Error seeding features:', error.message);
  } else {
    console.log(`✅ Seeded ${data.length} features`);
  }
}

seedFeatures();
