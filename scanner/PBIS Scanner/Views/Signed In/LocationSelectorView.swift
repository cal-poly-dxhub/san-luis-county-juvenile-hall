// MARK: Imports

import SwiftUI

// MARK: Views

struct LocationSelectorView: View {

    // MARK: Environment Objects

    @EnvironmentObject private var blm: BehaviorLocationManager

    // Location Preview
    @State private var locationSelectorSize: CGFloat = 1
    @State private var locationSelectorBGSize: CGFloat = 150

    let blurTintMix = 0.3

    let lowerDragThreshold: CGFloat = 150
    let upperDragThreshold: CGFloat = 300

    var body: some View {

        let drag = DragGesture(minimumDistance: 0)
            .onChanged({ state in
                guard state.translation.height >= 0 else { return }
                let indexRange = abs(state.translation.height / self.upperDragThreshold)
                let indexFloat = indexRange * CGFloat(self.blm.locations.count)

                if Int(indexFloat) < self.blm.locations.count {
                    let indexInt = Int(indexFloat.rounded(.down))
                    self.blm.selectedLocation = self.blm.locations[abs(indexInt)]
                }

                self.locationSelectorSize = abs(state.translation.height / (UIScreen.main.bounds.height * 4)) + 1

                if state.translation.height < self.upperDragThreshold {
                    self.locationSelectorBGSize = state.translation.height + self.lowerDragThreshold
                } else {
                    self.locationSelectorBGSize = self.upperDragThreshold + self.lowerDragThreshold + (0.2*(state.translation.height - self.upperDragThreshold))
                }
            })
            .onEnded { _ in
                self.locationSelectorSize = 0
                self.locationSelectorBGSize = self.lowerDragThreshold
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) { self.locationSelectorSize = 1 }
                UINotificationFeedbackGenerator().notificationOccurred(.success)

                if self.blm.behaviors.isEmpty || self.blm.locations.isEmpty {
                    self.blm.initializeLocations()
                    self.blm.initializeBehaviors()
                }
        }
        
        return ZStack(alignment: .top) {
            ZStack(alignment: .bottom) {
                Rectangle()
                    .foregroundColor(.orange)
                    .opacity(0.5)
                Text(blm.selectedLocation?.name.uppercased() ?? "LET GO TO REFRESH")
                    .foregroundColor(.white)
                    .font(.system(size: 30, weight: .black, design: Font.Design.monospaced))
                    .padding(.bottom)
            }
            .edgesIgnoringSafeArea(.all)
            .frame(height: locationSelectorBGSize)
            .opacity(locationSelectorBGSize == 150 ? 0 : 1)
            .disabled(locationSelectorBGSize == 150)

            HStack {
                BoxStringContainerView(text: String(blm.selectedLocation?.name.prefix(1) ?? "?"))
                    .aspectRatio(1, contentMode: .fit)
                    .frame(width: 40)
                    .scaleEffect(locationSelectorSize, anchor: .center)
                    .animation(.easeOut)
                    .font(.system(size: 30))
                    .onTapGesture {
                        guard self.blm.selectedLocation != nil else { return }
                        let index = self.blm.locations.firstIndex(of: self.blm.selectedLocation!)!
                        self.blm.selectedLocation = self.blm.locations[(index + 1) % self.blm.locations.count]
                }
                    .gesture(drag)
                    .onReceive(blm.$selectedLocation) { _ in
                        if self.blm.selectedLocation != self.blm.selectedLocation_PREV {
                            UIImpactFeedbackGenerator(style: .light).impactOccurred()
                        }
                }
                Text(blm.selectedLocation?.name ?? "👈 Drag this down")
                    .font(.system(size: 15))
            }
            .padding()
            .background(
                RoundedRectangle(cornerRadius: 10)
                    .strokeBorder(Color.gray.opacity(0.5), lineWidth: 0.5)
                    .background(
                        ZStack {
                            Color(UIColor(named: "DrawerBG_Tint")!)
                                .opacity(blurTintMix)
                            VisualEffectView(effect: UIBlurEffect(style: .systemMaterial))
                        }
                        .mask(RoundedRectangle(cornerRadius: 10))
                )
            )
                .padding(.top)

        }
    }
}

struct LocationSelectorView_Previews: PreviewProvider {
    static var previews: some View {
        LocationSelectorView()
    }
}
