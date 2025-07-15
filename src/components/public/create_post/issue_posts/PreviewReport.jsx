import React from 'react';
import {
  AtSign,
  Heart,
  Info,
  MapPin,
  MessageSquare,
  Upload,
  UserPlus,
} from 'lucide-react';

const PLACEHOLDER_IMAGES = [
  'https://via.placeholder.com/400x240?text=Image+1',
  'https://via.placeholder.com/400x240?text=Image+2',
  'https://via.placeholder.com/400x240?text=Image+3',
];

export default function PreviewReport({
  author,
  time,
  category,
  title,
  description,
  priority,
  nearbyLandmark,
  reportId,
}) {
  const renderImages = () => {
    const count = PLACEHOLDER_IMAGES.length;
    if (count === 0) return null;

    const remaining = count - 2;

    return (
      <div className="grid grid-cols-2 gap-2 mb-2 max-w-xl mx-auto mt-3">
        <img
          src={PLACEHOLDER_IMAGES[0]}
          alt="Image 1"
          className="w-full aspect-square object-cover rounded-md border border-gray-200"
        />
        <div className="relative w-full aspect-square">
          <img
            src={PLACEHOLDER_IMAGES[1]}
            alt="Image 2"
            className="w-full h-full object-cover rounded-md border border-gray-200"
          />
          {remaining > 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
              <span className="text-white text-lg font-semibold">
                +{remaining} more
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 font-sans flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-lg w-full max-w-3xl">
        <div className="p-5 sm:p-6">
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-gray-200 rounded-full flex-shrink-0" />
              <div>
                <div className="flex items-center flex-wrap gap-x-2">
                  <span className="font-semibold text-gray-800">
                    {author || 'Your Name'}
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full border border-gray-200">
                    Reporter
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Under category:{' '}
                  <span className="font-medium text-gray-700">
                    {category || 'General'}
                  </span>
                </p>
              </div>
            </div>
            <div className="inline-flex items-center space-x-1 bg-orange-100 text-orange-700 text-[12px] font-medium px-2.5 py-1 rounded-full mb-4 border border-orange-200">
              <AtSign className="w-4 h-4" />
              <span>{priority?.toUpperCase() || 'MEDIUM PRIORITY'}</span>
            </div>
          </header>

          {/* Main Content */}
          <main className="mt-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {title || 'Issue Title'}
            </h1>
            <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
              {description || 'Detailed issue description goes here.'}
            </p>

            {/* Report Tracking Card */}
            <section className="mt-4 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <p className="font-semibold text-yellow-900">Report Tracking</p>
                  <p className="text-sm text-yellow-800">
                    Report ID: {reportId || '#RPT-XXXXXX'}
                  </p>
                </div>
                <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">
                  SUBMITTED
                </span>
              </div>
              <div className="flex items-center space-x-2 pt-2 text-sm text-yellow-800">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span>
                  Landmark: {nearbyLandmark || 'Coordinates will be shown here'}
                </span>
              </div>
            </section>

            {/* Image Preview */}
            {renderImages()}
          </main>
        </div>

        {/* Footer Actions */}
        <footer className="p-5 sm:p-6 border-t border-gray-200 flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600">
          <button className="flex items-center space-x-1.5 hover:text-rose-500 transition-colors duration-200 group">
            <Heart className="w-5 h-5 group-hover:fill-rose-100" />
            <span className="text-sm font-medium">Support (0)</span>
          </button>
          <button className="flex items-center space-x-1.5 hover:text-blue-500 transition-colors duration-200">
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-medium">Comment (0)</span>
          </button>
          <div className="flex-grow hidden sm:block" />
          <button className="flex items-center space-x-1.5 hover:text-gray-900 transition-colors duration-200">
            <Upload className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
          <button className="flex items-center space-x-1.5 hover:text-gray-900 transition-colors duration-200">
            <UserPlus className="w-5 h-5" />
            <span className="text-sm font-medium">Follow</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
